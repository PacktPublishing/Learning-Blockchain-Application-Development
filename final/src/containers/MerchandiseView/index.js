import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'

import Avatar from 'material-ui/Avatar'
import { blue300, indigo900 } from 'material-ui/styles/colors'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import Chip from 'material-ui/Chip'
import ContentAdd from 'material-ui/svg-icons/content/add'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Snackbar from 'material-ui/Snackbar'
import Toggle from 'material-ui/Toggle'

import * as merchandiseCreators from 'core/actions/actions-merchandise'


const fabStyle = {
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 20,
  left: 'auto',
  position: 'fixed'
}

const toggleStyle = {
  block: {
    maxWidth: 250
  },
  toggle: {
    marginBottom: 16
  }
}

class MerchandiseView extends Component {
  constructor(props) {
    super(props)
    this.buyItem = this.buyItem.bind(this)
    this.getAvailableItems = this.getAvailableItems.bind(this)
    this.state = {
      open: false,
      message: ''
    }
  }

  componentDidMount() {
    console.log('Calling componentDidMount')
    setInterval(() => this.getAvailableItems(), 5000)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.provider.web3Provider !== nextProps.provider.web3Provider) {
      this.getAvailableItems()
    }
    if (nextProps.merchandise.transaction !== this.props.merchandise.transaction) {
      console.log(nextProps.merchandise.transaction)
      this.setState({
        message: nextProps.merchandise.transaction.tx,
        open: true
      })
    }
  }

  getAvailableItems() {
    console.log('Checking...')
    const { actions } = this.props
    actions.merchandise.getItem(0)
  }

  render() {
    return (
      <div>
                <Card>
                    <CardHeader
                        title={this.props.merchandise.merchandise.itemName}
                        />
                    <CardText>
                        {this.props.merchandise.merchandise.itemDesc}
                        <Chip
                            backgroundColor={blue300}
                            onClick={this.buyItem}
                            >
                            <Avatar size={32} color={blue300} backgroundColor={indigo900}>
                                {this.props.merchandise.merchandise.itemSold === true ? 'Sold' : 'Buy' }
                            </Avatar>
                            {`${this.props.merchandise.merchandise.itemPrice} ETH`}
                        </Chip>
                        <div style={toggleStyle.block}>
                            <Toggle
                                label="Shipped"
                                style={toggleStyle.toggle}
                                disabled={!this.props.merchandise.merchandise.itemSold}
                                />
                            <Toggle
                                label="Received"
                                disabled={!this.props.merchandise.merchandise.itemShipped}
                                />
                        </div>
                    </CardText>
                </Card>
                <FloatingActionButton onClick={this.addMerchandise} style={fabStyle}>
                    <ContentAdd />
                </FloatingActionButton>
                <Snackbar
                    message={this.state.message}
                    open={this.state.open}
                    />
            </div>
    )
  }

  buyItem() {
    const { actions } = this.props
    actions.merchandise.buyItem(
            this.props.merchandise.merchandise.itemId,
            this.props.merchandise.merchandise.itemPrice
        )
  }

  addMerchandise=() => {
    const { provider, history } = this.props
    if (provider.web3Provider !== null) {
      history.push('/add')
    } else {
      alert('No web3 provider detected')
    }
  }

}


MerchandiseView.propTypes = {
  actions: PropTypes.object,
  history: PropTypes.object,
  provider: PropTypes.object,
  merchandise: PropTypes.object
}

function mapStateToProps(state) {
  return {
    provider: state.provider,
    merchandise: state.merchandise
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      merchandise: bindActionCreators(merchandiseCreators, dispatch)
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MerchandiseView))
