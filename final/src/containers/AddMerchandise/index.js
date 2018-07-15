import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'

import { Card, CardHeader, CardText } from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

import * as merchandiseCreators from 'core/actions/actions-merchandise'

class AddMerchandise extends Component {
    constructor(props) {
        super(props)

        this.state = {
            itemName: '',
            itemDesc: '',
            itemPrice: ''
        }
    }

    handleNewItem = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    render() {
        return (
            <div>
                <Card>
                    <CardHeader
                        title="List new goods/services for sale"
                        subtitle="Got something to sell? List it here!"
                    />
                    <CardText>
                        <TextField
                            hintText="What are you offering?"
                            floatingLabelText="Name of Goods/Service"
                            id="itemName"
                            value={this.state.itemName}
                            onChange={this.handleNewItem}
                        /><br />
                        <TextField
                            hintText="Description of goods or services being offered."
                            floatingLabelText="Description"
                            multiLine={true}
                            id="itemDesc"
                            value={this.state.itemDesc}
                            onChange={this.handleNewItem}
                        /><br />
                        <TextField
                            floatingLabelText="Price (in Ether)"
                            hintText="0"
                            id="itemPrice"
                            value={this.state.itemPrice}
                            onChange={this.handleNewItem}
                        /><br />
                        <RaisedButton
                            label="Add Listing"
                            onClick={this.addListing}
                            primary={true}
                        />
                    </CardText>
                </Card>
            </div>
        )
    }

    addListing = () => {
        const { actions } = this.props
        const { history } = this.props
        const merch = {
            itemName: this.state.itemName,
            itemDesc: this.state.itemDesc,
            itemPrice: this.state.itemPrice
        }
        actions.merchandise.addListing(merch)
        history.push('/')
    }
}

AddMerchandise.propTypes = {
    actions: PropTypes.object,
    history: PropTypes.object,
    provider: PropTypes.object,
    merchandise: PropTypes.object
}

function mapStateToProps(state) {
    const merch = {
        itemName: state.itemName,
        itemDesc: state.itemDesc,
        itemPrice: state.itemPrice
    }
    return {
      provider: state.provider,
      merchandise: merch
    }
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      actions: {
        merchandise: bindActionCreators(merchandiseCreators, dispatch)
      }
    }
  }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddMerchandise))