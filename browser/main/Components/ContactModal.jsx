var React = require('react')

var LinkedState = require('../Mixins/LinkedState')
var KeyCaster = require('../Mixins/KeyCaster')

var Hq = require('../Services/Hq')

module.exports = React.createClass({
  mixins: [LinkedState, KeyCaster('contactModal')],
  propTypes: {
    close: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      isSent: false,
      mail: {
        title: '',
        content: ''
      }
    }
  },
  onKeyCast: function (e) {
    switch (e.status) {
      case 'closeModal':
        this.props.close()
        break
      case 'submitContactModal':
        if (this.state.isSent) {
          this.props.close()
          return
        }
        this.sendEmail()
        break
    }
  },
  componentDidMount: function () {
    React.findDOMNode(this.refs.title).focus()
  },
  sendEmail: function () {
    Hq.sendEmail(this.state.mail)
      .then(function (res) {
        this.setState({isSent: !this.state.isSent})
      }.bind(this))
      .catch(function (err) {
        console.error(err)
      })
  },
  render: function () {
    return (
      <div className='ContactModal modal'>
        <div className='modal-header'><h1>Contact form</h1></div>

        {!this.state.isSent ? (
          <div className='contactForm'>
            <div className='modal-body'>
              <div className='formField'>
                <input ref='title' valueLink={this.linkState('mail.title')} placeholder='Title'/>
              </div>
              <div className='formField'>
                <textarea valueLink={this.linkState('mail.content')} placeholder='Content'/>
              </div>
            </div>

            <div className='modal-footer'>
              <div className='formControl'>
                <button onClick={this.sendEmail} className='sendButton'>Send</button>
                <button onClick={this.props.close}>Cancel</button>
              </div>
            </div>
          </div>
      ) : (
          <div className='confirmation'>
            <div className='confirmationMessage'>Thanks for sharing your opinion!</div>
            <button className='doneButton' onClick={this.props.close}>Done</button>
          </div>
        )}
      </div>
    )
  }
})
