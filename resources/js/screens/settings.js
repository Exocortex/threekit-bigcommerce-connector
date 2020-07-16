import React from "react";
import { Spinner, Table } from "../components";
import "./style.css";
import { ApiService } from "../services/ApiService";

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
    // getScripts()
    this.setState({ isSaved: false });
    console.log("closed");
  }
  // Function to create scripts with form info
  addScript(url) {
    var res = encodeURI(url);
    ApiService.addScript(
      "v3/content/scripts",
      JSON.stringify({
        name: "Threekit",
        description: "Enable configurable 3D & AR for your products",
        // html:
        // '<script src=\\"https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js\\"></script>',
        src: res,
        auto_uninstall: true,
        load_method: "default",
        location: "head",
        visibility: "all_pages",
        kind: "src",
        consent_category: "essential",
      })
    )
      .then((res) => {
        console.log(res);
        formSave = true;
        this.setState({ isSaved: true, currentJS: res.data.data.src });
      })
      .catch((error) => {
        console.log(error);
        // this.setState({ submitErr: true });
      });
  }

  updateScript(id, url) {
    ApiService.updateResourceEntry(
      "v3/content/scripts/" + id,
      JSON.stringify({
        name: "Threekit",
        description: "Enable configurable 3D & AR for your products",
        // html:
        // '<script src=\\"https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js\\"></script>',
        src: url,
        auto_uninstall: true,
        load_method: "default",
        location: "head",
        visibility: "all_pages",
        kind: "src",
        consent_category: "essential",
      })
    )
      .then((res) => {
        console.log(res.status);
        this.setState({ isSaved: true, currentJS: res.data.data.src });

        // Saving the tk widget
        // if (this.state.hasTkWidgetTemplate == false) {
        //   createWidgetTemplate(this.state.tkToken);
        // } else {
        //   updateWidgetTemplate(this.state.tkWidgetTemplateId);
        // }
      })
      .catch((error) => {
        console.log(error);
        // this.setState({ submitErr: true });
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
      console.log("UPDATED");
      console.log(res);
      this.setState({ loading: false });
      this.setState({ isSaved: true });

      // if The brand is 38 (Threekit) list product informatiom
      // res.data.data.forEach(e => e.brand_id == 38? console.log(e) : console.log(""))
    });
  }

  deleteWidgetTemplate(id) {
    ApiService.deleteResourceEntry("v3/content/widget-templates/" + id).then(
      (res) => {
        console.log("DELETED");
        console.log(res);
        // if The brand is 38 (Threekit) list product informatiom
        // res.data.data.forEach(e => e.brand_id == 38? console.log(e) : console.log(""))
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
        console.log("CREATED");
        console.log(res);
        this.setState({
          isSaved: true,
          loading: false,
          currentToken: this.extractFirstText(res.data.data.template),
        });

        // if The brand is 38 (Threekit) list product informatiom
        // res.data.data.forEach(e => e.brand_id == 38? console.log(e) : console.log(""))
      })
      .catch((error) => {
        // this.setState({ submitErr: true });
        console.log(error);
      });
  }

  getScripts() {
    ApiService.getScripts("v3/content/scripts")
      .then((res) => {
        // console.log(res);
        

        if (res.data.data.length == 0) {
          console.log("no scripts");
          this.setState({ loading: false });
        } else
          res.data.data.forEach((e) => {
            if (e.name == "Threekit") {
              console.log(e.src);
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

        // This is too early
        // this.setState({ loading: false });
      });
  }

  componentWillMount() {
    //will mount comp

    // Test widget placement
    // ApiService.getResourceEntry(
    //   "v3/content/regions?templateFile=pages/product"
    // ).then((res) => {
    //   console.log("TEMPLATE REGIONS");
    //   console.log(res);
    // });

// Check for scripts
    this.getScripts();

    // ApiService.getResourceEntry("v3/content/regions?templateFile=pages/product").then((res) => {
    //   console.log("PAGES")
    //   console.log(res)
    // })

    // ApiService.getResourceEntry("v3/content/widget-templates").then((res) => {
    //   console.log("widget check");
    //   console.log(res);
    //   this.setState({ loading: false });
    //   if (res.data.data.length < 1) {
    //     console.log("no widget templates");
    //   } else {
    //     res.data.data.forEach((e) => {
    //       if (e.name == "Threekit") {
    //         this.setState({ hasTkWidgetTemplate: true });
    //         console.log("widget-templates");
    //         console.log("grab text");
    //         console.log(this.extractFirstText(e.template));

    //         this.setState({ currentToken: this.extractFirstText(e.template) });
    //         console.log(e.template.includes("authToken"));

    //         this.setState({ tkWidgetTemplateId: e.uuid });
    //       }
    //     });
    //   }
    // });

    ApiService.getResourceEntry("v3/content/widgets").then((res) => {
      console.log("widgets proper");
      this.setState({ loading: false });
      console.log(res);
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
          // onBack={() => null}
          title="Threekit Setup"
        >
          <Content>
            Here is where you will enter your Threekit credentials to
            authenticate your BigCommerce store with your Threekit org. Enter
            your Threekit Javascript environment link and org token.
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
            {this.state.tkWidgetTemplateId ? (
                        <div>
                          <Collapse>
                            <Panel header={"Uninstall Directions"}>
                              Delete Threekit widget before uninstalling the
                              app. If you accidentally delete the widget, save
                              your org token to re-create it.<br/>
                              <Button
                                type="primary"
                                htmlType="submit"
                                onClick={() =>
                                  this.deleteWidgetTemplate(
                                    this.state.tkWidgetTemplateId
                                  )
                                }
                              >
                                Delete Widget.
                              </Button>
                            </Panel>
                          </Collapse>
                        </div>
                      ) : (
                        <p>
                          No Threekit widget. Save your JS enviornment and Threekit org token to create it. 
                        </p>
                      )}
          </Content>
        </PageHeader>
        <Layout>
          <Content>
            <div className="container">
                <Spinner />
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
            </div>
          </Content>
        </Layout>
      </div>
    );
  }
}
