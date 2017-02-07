import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor'; // Imported bc user accounts
import { createContainer } from 'meteor/react-meteor-data';

import { Cards } from '../api/cards.js';

import Card from './Card.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
class App extends Component {

  createCard(e) {
    e.preventDefault();
    // Get the values from the form input
    const businessName = ReactDOM.findDOMNode(this.refs.businessName).value.trim();
    const totalPunches = Number(ReactDOM.findDOMNode(this.refs.numberPunches).value);
    // Create entry in db
    Meteor.call('cards.create', businessName, totalPunches);
    // Clear form
    ReactDOM.findDOMNode(this.refs.businessName).value = '';
  }

  renderCards() {
    return this.props.cards.map((card) => (
      <Card key={card._id} card={card} />
    ));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Coulo</h1>
          <h2>The easy loyalty rewards platform for everyone</h2>
          <AccountsUIWrapper />
        </header>
        { this.props.currentUser ?
          <h3>Welcome back, {this.props.currentUser.username}!</h3>
          : ''
        }
        <ul>
          {this.renderCards()}
        </ul>

        <button id="add-cards">Add cards</button>
        <button id="register-card">Register card</button>

        <form className="card-registration" onSubmit={this.createCard.bind(this)}>
          <input
            type="text"
            ref="businessName"
            placeholder="Name of Business" />
          <input
            type="number"
            ref="numberPunches"
            min="5" max="500"/>
          <input
            type="submit" />
        </form>
      </div>
    );
  }
}

App.propTypes = {
  cards: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {

  Meteor.subscribe('cards');

  return {
    cards: Cards.find({}).fetch(),
    currentUser: Meteor.user(),
  };
}, App);
