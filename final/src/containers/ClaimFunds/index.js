import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'

import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'

import * as merchandiseCreators from 'core/actions/actions-merchandise'


class ClaimFunds extends Component {
    constructor(props) {
        super(props)
        this.claimFunds = this.claimFunds.bind(this)
        this.state = {
            open: false,
            message: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.merchandise.transaction !== this.props.merchandise.transaction) {
            this.setState({
                message: nextProps.merchandise.transaction,
                open: true
            })
        }
    }

    claimFunds() {
        const { actions, history } = this.props
        actions.merchandise.claimFunds()
    }

    render() {
        return (
            <div>
                <RaisedButton
                    label="Claim Funds"
                    onClick={this.claimFunds}
                    primary={true}
                />
                <Snackbar
                    message={this.state.message}
                    open={this.state.open}
                />
            </div>
        )
    }
}

ClaimFunds.propTypes = {
    provider: PropTypes.object,
    history: PropTypes.object,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ClaimFunds))