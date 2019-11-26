import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Cookies from 'universal-cookie';
import {close, getCurrentHub} from '@sentry/browser';
import moment from 'moment';

/**
 * The Telemetry Popup which asks for user consent to collect
 * telemetry.
 * Pre-Conditions: The user has not already set the telemetry
 * cookie.
 * Post-Conditions: The telemetry cookie is set in accordance
 * with the users selection.
 * @return {any} A react component which is the telemetry
 * modal rendered
 */
export default function TelemetryModal() {
  const cookies = new Cookies();
  const prompt = cookies.get('telemetry');

  const [show, setShow] = useState(prompt === undefined);
  const handleClose = () => {
    setShow(false);
    cookies.set('telemetry', true, {expires: moment()
        .add(5, 'years').toDate()});
  };

  const handleDisable = async () => {
    setShow(false);
    cookies.set('telemetry', false, {expires: moment()
        .add(30, 'days').toDate()});
    await close();

    // Could be undefined
    const sentryClient = getCurrentHub().getClient();
    if (sentryClient) {
      sentryClient.getOptions().enabled = false;
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Telemetry Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Telemetry is automatically sent to help improve our application.
          Please consider leaving this option on to ensure a more
          optimized experience.
          <br></br><br></br>
          <p className="text-muted">You can disable telemetry with the
          button below.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDisable}>
            Disable Telemetry
          </Button>
          <Button variant="primary" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
