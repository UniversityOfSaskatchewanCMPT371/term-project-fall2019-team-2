import React, {Component} from 'react';
import * as Sentry from '@sentry/browser';
import {ErrorBoundaryInterface} from './ErrorBoundaryInterface';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

/**
 * The Error Boundary Class wraps all components to provide a custom error
 * handling component. This allows for user feedback on render breaking errors.
 */
export class ErrorBoundary extends Component<ErrorBoundaryInterface,
ErrorBoundaryInterface> {
  /**
   * The constructor
   * Pre-Conditions: None.
   * Post-Conditions: None.
   * @param {ErrorBoundaryInterface} props The
   * properties for the ErrorBoundary, see the interface
   * for more relevant documentation
   */
  constructor(props: ErrorBoundaryInterface) {
    super(props);
    this.state = {
      eventId: undefined,
      hasError: false,
      error: props.error,
      errorInfo: 'Unknown'
    };
  }

  /**
   * Set the new state from an error.
   * Pre-Conditions: This component wraps a child component.
   * Post-Conditions: This component will need to be re-rendered and will
   * likely replace the child components.
   * @param {Error} error The error that occurred.
   * @return {any} A dictionary of the new state with hasError set to true
   */
  static getDerivedStateFromError(error: Error) {
    return {hasError: true};
  }

  /**
   * Called if the error was caught by this component.
   * Pre-Conditions: This component wraps a child component.
   * Post-Conditions: This component will need to be re-rendered and will
   * likely replace the child components.
   * @param {Error} error The error caught
   * @param {any} errorInfo The additional information about the error
   */
  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error occurred!');
    console.error(`${error} - ${errorInfo}`);
    this.setState({error, errorInfo});
    Sentry.withScope((scope) => {
      scope.setExtras(errorInfo);
      const eventId = Sentry.captureException(error);
      this.setState({eventId});
    });
  }

  /**
   * Renders over the child component if a error stat is reached.
   * @return {any} The component.
   */
  render() {
    if (this.state.hasError) {
      // render fallback UI
      return (
        <>
          <Alert variant="danger">
            <Alert.Heading>Uh oh...</Alert.Heading>
            <p>
                  It looks like we ran into an error.
                  Please consider giving us feedback
                  on how you reached this bug so it can be resolved.
              <br></br><br></br>
              <samp>{this.state.error.message}</samp>
            </p>
            <hr />
            <div className="d-flex justify-content-end">
              <Button onClick={() =>
                Sentry.showReportDialog({eventId: this.state.eventId})}
              variant="outline-primary">
                  Report Feedback
              </Button>
            </div>
          </Alert>
        </>
      );
    }

    // when there's not an error, render children untouched
    return this.props.children;
  }
}

export default ErrorBoundary;
