import React from "react";
import { Spinner, Table } from "../components";
import "./style.css";
import { ApiService } from "../services/ApiService";

import { Layout, Button, PageHeader, Form, Input, Alert, Spin } from "antd";

const { Header, Content, Sider } = Layout;

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

export default class Help extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: "",
    };
  }

  componentWillMount() {
    //will mount
  }

  render() {
    return (
      <div className="container">
        <PageHeader
          className="site-page-header"
          // onBack={() => null}
          title="Threekit Help"
        ></PageHeader>
        <Layout>
          <Content>
            <div className="container">
              {this.state.loading ? (
                <Spinner />
              ) : (
                <Content className="help-content">
                  <h4>
                    Not a Threekit customer?
                  </h4>
                  <p>Learn more about our platform <a href="https://www.threekit.com/platform-overview" target="_blank">here</a>.</p>
                  <hr />
            
                  <h4>
                    I've put a Threekit widget on my store but I cannot see
                    anything.
                  </h4>
                  <p>Try the following to troubleshoot:</p>
                  <ul>
                    <li>
                      Make sure your Javascript environment matches the location
                      of your Threekit org.
                    </li>
                    <li>
                      Check your Threekit{" "}
                      <a
                        href="https://docs.threekit.com/docs/tokens"
                        target="_blank"
                      >
                        token,{" "}
                      </a>
                      <a
                        href="https://docs.threekit.com/docs/catalog-items"
                        target="_blank"
                      >
                        catalog item,{" "}
                      </a>
                      and/or{" "}
                      <a
                        href="https://docs.threekit.com/docs/assets"
                        target="_blank"
                      >
                        scene ID{" "}
                      </a>
                      and make sure they are correct
                    </li>
                  </ul>
                  <p>
                    Reference our{" "}
                    <a href="https://docs.threekit.com/docs" target="_blank">
                      docs{" "}
                    </a>
                    for additional information.
                  </p>
                  <hr/> 
                  <h4>
                    Need additional help?
                  </h4>
                  <p>Visit our support page <a href="https://www.threekit.com/success" target="_blank">here</a>.</p>
                  <hr />
                </Content>
              )}
            </div>
          </Content>
        </Layout>
      </div>
    );
  }
}
