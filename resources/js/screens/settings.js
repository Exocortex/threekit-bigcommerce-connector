import React from "react";
import { Spinner, Table } from "../components";
import "./style.css";
import { ApiService } from "../services/ApiService";
import { Link } from "react-router-dom";

import { Layout, Button, PageHeader, Form, Input, Alert, Collapse } from "antd";

const { Header, Content, Sider } = Layout;
const { Panel } = Collapse;

// Form styles
const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

// End form styles

// testing alert
let formSave = false;

export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: "",
      isJSLoading: true,
      loading: true,
      hasScript: false,
      scriptId: "",
      tkJS: "",
      tkToken: "",
      currentToken: "No token saved",
      currentJS: "No Javascript environment selected",
      hasTkWidgetTemplate: false,
      hasTkWidget: false,
      tkWidgetTemplateId: "",
      isSaved: false,
      submitErr: false,
    };
  }

  // Extract token from widget-template. This grabs the first occurance of text between double quotes, which is the token.
  // Not the best solution but it will do for now.
  extractFirstText(str) {
    const matches = str.match(/"(.*?)"/);
    return matches ? matches[1] : str;
  }

  handleClose() {
    this.setState({ isSaved: false });
    console.log("closed");
  }
  // Function to create scripts with form info
  addScript(url) {
    var res = encodeURI(url);
    ApiService.createResourceEntry(
      "v3/content/scripts",
      JSON.stringify({
        name: "Threekit",
        description: "Enable configurable 3D and AR for your products",
        src: res,
        auto_uninstall: true,
        load_method: "default",
        location: "head",
        visibility: "storefront",
        kind: "src",
        consent_category: "functional",
      })
    )
      .then((res) => {
        console.log(res);
        formSave = true;
        this.setState({ isSaved: true, currentJS: res.data.data.src });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateScript(id, url) {
    ApiService.updateResourceEntry(
      "v3/content/scripts/" + id,
      JSON.stringify({
        name: "Threekit",
        description: "Enable configurable 3D & AR for your products",
        src: url,
        auto_uninstall: true,
        load_method: "default",
        location: "head",
        visibility: "storefront",
        kind: "src",
        consent_category: "functional",
      })
    )
      .then((res) => {
        console.log(res.status);
        this.setState({ isSaved: true, currentJS: res.data.data.src });

      
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateWidgetTemplate(id, token) {
    ApiService.updateResourceEntry(
      "v3/content/widget-templates/" + id,
      JSON.stringify({
        name: "Threekit",
        template: `<div id='tkplayer_{{assetId}}' style='height: {{ height }}; width: {{ width }}'></div><script>     window
          .threekitPlayer({
            authToken: "${token}",
            el: document.getElementById("tkplayer_{{assetId}}"),
            stageId: '{{ stageId }}',
            assetId: "{{ assetId }}",
            showConfigurator: "{{ showConfigurator }}",
            showAR: "{{ showAR }}"
          })
          .then(async api => {
             window.player = api;
             window.configurator = await api.getConfigurator();
      }); </script>`,

        schema: [
          {
            label: "Threekit Settings",
            type: "tab",
            sections: [
              {
                label: "Threekit Player Settings",
                settings: [
                  {
                    id: "assetId",
                    label: "Threekit Product ID",
                    type: "input",
                  },
                  { id: "stageId", label: "Threekit Stage ID", type: "input" },

                  {
                    id: "width",
                    label: "Player Width (%, px, vw)",
                    type: "input",
                  },
                  {
                    id: "height",
                    label: "Player Height (%, px, vw)",
                    type: "input",
                  },
                  { id: "showAR", label: "Enable AR", type: "boolean" },
                  {
                    id: "showConfigurator",
                    label: "Show Config Form",
                    type: "boolean",
                  },
                ],
              },
            ],
            meta: { tkid: "token" },
          },
        ],
      })
    ).then((res) => {
    
      this.setState({ loading: false });
      this.setState({ isSaved: true });

    });
  }

  deleteWidgetTemplate(id) {
    ApiService.deleteResourceEntry("v3/content/widget-templates/" + id).then(
      (res) => {
        this.setState({ isSaved: true,  currentToken: "No token saved", hasTkWidgetTemplate: null});

      }
    );
  }

  createWidgetTemplate(token) {
    ApiService.createResourceEntry(
      "v3/content/widget-templates",
      JSON.stringify({
        name: "Threekit",
        template: `<div id='tkplayer_{{assetId}}' style='height: {{ height }}; width: {{ width }}'></div><script>     window
          .threekitPlayer({
            authToken: "${token}",
            el: document.getElementById("tkplayer_{{assetId}}"),
            stageId: '{{ stageId }}',
            assetId: "{{ assetId }}",
            showConfigurator: "{{ showConfigurator }}",
            showAR: "{{ showAR }}"
          })
          .then(async api => {
             window.player = api;
             window.configurator = await api.getConfigurator();
      }); </script>`,

        schema: [
          {
            label: "Threekit Settings",
            type: "tab",
            sections: [
              {
                label: "Threekit Player Settings",
                settings: [
                  {
                    id: "assetId",
                    label: "Threekit Product ID",
                    type: "input",
                  },
                  { id: "stageId", label: "Threekit Stage ID", type: "input" },

                  {
                    id: "width",
                    label: "Player Width (%, px, vw)",
                    type: "input",
                  },
                  {
                    id: "height",
                    label: "Player Height (%, px, vw)",
                    type: "input",
                  },
                  { id: "showAR", label: "Enable AR", type: "boolean" },
                  {
                    id: "showConfigurator",
                    label: "Show Config Form",
                    type: "boolean",
                  },
                ],
              },
            ],
            meta: { tkid: "token" },
          },
        ],
      })
    )
      .then((res) => {
        this.setState({
          isSaved: true,
          loading: false,
          currentToken: this.extractFirstText(res.data.data.template),
        });

      })
      .catch((error) => {
        
        console.log(error);
      });
  }

  getScripts() {
    ApiService.getScripts("v3/content/scripts")
      .then((res) => {

        if (res.data.data.length == 0) {
        } else
          res.data.data.forEach((e) => {
            if (e.name == "Threekit") {
              this.setState({
                isJSLoading: false,
                tkJS: e.src,
                hasScript: true,
                scriptId: e.uuid,
                loading: false,
                currentJS: e.src,
              });
            } else if (e.name != "Threekit") {
              this.setState({ loading: false });
            }
          });
      })
      .catch((error) => {
        console.error(error);

      });
  }

  getWidgets(){
    ApiService.getResourceEntry("v3/content/widget-templates").then((res) => {
      this.setState({ loading: false });
      if (res.data.data.length < 1) {
      } else {
        res.data.data.forEach((e) => {
          if (e.name == "Threekit") {
            this.setState({ hasTkWidgetTemplate: true });

            this.setState({ currentToken: this.extractFirstText(e.template) });

            this.setState({ tkWidgetTemplateId: e.uuid });
          }
        });
      }
    });
  }

  componentWillMount() {
    //will mount comp
    setInterval(function(){
      location.reload();
    },900000)

    this.getWidgets();

    // Check for scripts
    this.getScripts();


  

    ApiService.getResourceEntry("v3/content/widgets").then((res) => {
      this.setState({ loading: false });
    });
  }

  render() {
    const handleChange = (e) => {
      this.setState({ [e.target.id]: e.target.value });
    };
    return (
      <div className="container">
        <PageHeader
          className="site-page-header"
          title="Threekit Setup"
        >
          <Content>
            Welcome to Threekit's BigCommerce connector. To get started,
            authenticate your store by entering your Threekit details in the
            form below. Not sure where to start? Please visit the 
            <Link to="/help"> help</Link> screen.
            <br />
            <br />
            <p>
              <b>Current JS Environment: </b>
              {this.state.loading ? "loading..." : this.state.currentJS}
            </p>
            <p>
              <b>Current Org Token: </b>
              {this.state.loading ? "loading..." : this.state.currentToken}
            </p>
            {this.state.currentToken != "No token saved" ? (
              <div>
                <Collapse>
                  <Panel header={"Uninstall Directions"}>
                    Delete Threekit widget before uninstalling the app. If you
                    accidentally delete the widget, save your org token to
                    re-create it.
                    <br />
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={() =>
                        this.deleteWidgetTemplate(this.state.tkWidgetTemplateId)
                      }
                    >
                      Delete Widget.
                    </Button>
                  </Panel>
                </Collapse>
              </div>
            ) : (
              <p>
                No Threekit widget. Save your JS enviornment and Threekit org
                token to create it.
              </p>
            )}
          </Content>
        </PageHeader>
        <Layout>
          <Content>
            <div className="container">
              {this.state.loading ? (
                <Spinner />
              ) : (
                <Content>
                  <div className="alert-container">
                    {this.state.isSaved ? (
                      <Alert
                        message="Information Saved"
                        type="success"
                        closable
                        onClose={this.handleClose.bind(this)}
                      />
                    ) : (
                      <p></p>
                    )}
                    {this.state.submitErr ? (
                      <Alert
                        message="Please enter a valid URL"
                        type="error"
                        closable
                        onClose={this.handleClose.bind(this)}
                      />
                    ) : (
                      <p></p>
                    )}
                  </div>

                  <Form
                    {...formLayout}
                    layout={"horizontal"}
                    size={"small"}
                    className="settings-form"
                  >
                    {this.state.isJSLoading ? (
                      <Form.Item
                        label="Javascript Environment"
                        name="javascript"
                      >
                        <Input
                          style={{ width: "80%" }}
                          placeholder="No Javascript Environment selected"
                          className="settings-input"
                          id="tkJS"
                          onChange={(e) => handleChange(e)}
                          value={this.state.tkJS}
                        />
                      </Form.Item>
                    ) : (
                      <Form.Item
                        label="Javascript Environment"
                        name="javascript"
                      >
                        <Input
                          style={{ width: "80%" }}
                          placeholder={this.state.tkJS}
                          className="settings-input"
                          id="tkJS"
                          onChange={(e) => handleChange(e)}
                          value={this.state.tkJS}
                        />
                      </Form.Item>
                    )}
                    <Form.Item {...tailLayout}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        onClick={() =>
                          this.state.hasScript
                            ? this.updateScript(
                                this.state.scriptId,
                                this.state.tkJS
                              )
                            : this.addScript(this.state.tkJS)
                        }
                      >
                        Save Javascript
                      </Button>
                    </Form.Item>

                    <Form.Item label="Org Token" name="token">
                      <Input
                        style={{ width: "80%" }}
                        placeholder={this.state.currentToken}
                        className="settings-input"
                        id="tkToken"
                        value={this.state.tkToken}
                        onChange={(e) => handleChange(e)}
                      />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        onClick={() =>
                          this.state.hasTkWidgetTemplate
                            ? this.updateWidgetTemplate(
                                this.state.tkWidgetTemplateId,
                                this.state.tkToken
                              )
                            : this.createWidgetTemplate(this.state.tkToken)
                        }
                      >
                        Save Token
                      </Button>
                   
                    </Form.Item>
                    {/* <Form.Item {...tailLayout}>
              
                    </Form.Item> */}
                  </Form>
                </Content>
              )}
            </div>
          </Content>
        </Layout>
      </div>
    );
  }
}
