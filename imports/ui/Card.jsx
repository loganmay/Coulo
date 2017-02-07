import React, { Component, PropTypes } from 'react';

import { Cards } from '../api/cards.js';

// Card component - represents a single punch card
export default class Card extends Component {

  renderPunches() {
    var punches = [];
    const total = this.props.card.totalPunches;
    const punched = this.props.card.punched;
    const diff = total - punched;
    for (var i = 0; i < punched; i++) {
      punches.push(<li>X</li>)
    }
    for (var i = 0; i < diff; i++) {
      punches.push(<li>O</li>)
    }
    return (
      <ul className="punches">
        {punches}
      </ul>
    );
  }

  deleteCard() {
    Meteor.call('cards.remove', this.props.task._id);
  }

  punchCard() {
    const total = this.props.card.totalPunches;
    const punched = this.props.card.punched;
    Meteor.call('cards.punch', this.props.card._id, total, punched);
  }

  render() {
    return (
      <li className="card">
          <h3>{this.props.card.businessName}</h3>
          <button onClick={this.deleteCard.bind(this)}>&times;</button>
          <button onClick={this.punchCard.bind(this)}>Punch</button>
          {this.renderPunches()}
      </li>
    );
  }
}

Card.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  card: PropTypes.object.isRequired,
};
