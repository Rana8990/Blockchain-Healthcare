import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Navbar from './Navbar'
import Healthcare from '../abis/Healthcare.json'
import Main from './Main'

class App extends Component {
  

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  
  async loadBlockchainData(){
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    const networkId = await web3.eth.net.getId()
    const networkData = Healthcare.networks[networkId]
    if(networkData){
      const healthcare = new web3.eth.Contract(Healthcare.abi, networkData.address)
      this.setState({ healthcare })
      const reportCount = await healthcare.methods.reportCount().call()
      this.setState({ reportCount })

      for (var i = 1; i <= reportCount; i++) {
        const report = await healthcare.methods.reports(i).call()
        this.setState({
          reports: [...this.state.reports, report]
        })
      }

      this.setState({ loading: false})

    } else{
      window.alert('Healthcare contract not deployed to detected network.')
    }
    
  }

  constructor(props){
    super(props)
    this.state = {
      account: '',
      reportCount: 0,
      reports: [],
      loading: true
    }

    this.createReport = this.createReport.bind(this)
  }

  createReport(name, date, fileURL) {
    this.setState({ loading: true })
    this.state.healthcare.methods.createReport(name, date, fileURL).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
            { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main reports={this.state.reports}
                  createReport={this.createReport} />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
