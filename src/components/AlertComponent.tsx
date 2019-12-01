import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from 'react-bootstrap/Alert';


// eslint-disable-next-line require-jsdoc
export default class AlertComponent extends React.Component {
  private show: any;
  private setShow: any;
  private error:string;
  /**
   * Purpose: constructor for the AlertComponent
   * @param {AlertComponent} error
   */
  // eslint-disable-next-line constructor-super,require-jsdoc
  constructor(error:string) {
    // @ts-ignore
    super();
    this.error = error;
  }
  // eslint-disable-next-line require-jsdoc
  useStatehelper() {
    this.show = true;
  }

  // eslint-disable-next-line require-jsdoc
  alertDisplayer(): any {
    this.useStatehelper();
    if (this.show) {
      // @ts-ignore
      return (
        <Alert variant="danger" onClose={() => this.show=false} dismissible>
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>
            error
          </p>
        </Alert>
      );
    }
  };

  // eslint-disable-next-line require-jsdoc
  render() {
    // eslint-disable-next-line new-cap
    return this.alertDisplayer();
  };
}

