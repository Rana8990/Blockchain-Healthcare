import React, { Component } from 'react';
import { create } from 'ipfs-http-client';
const client=create({host:'127.0.0.1',port:5001,protocol:'http'});
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { fileCID: null };
    this.fileInput = React.createRef();

    this.handleUploadToIPFS = this.handleUploadToIPFS.bind(this)

  }

  async handleUploadToIPFS() {
    const file = this.fileInput.current.files[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const { cid } = await client.add(reader.result);
        const fileCID = cid.toString();
        await this.setState({ fileCID });
        const fileURL = `http://localhost:8080/ipfs/${fileCID}`;
        console.log(fileURL);
        await this.setState({ fileURL });

      };
      reader.readAsArrayBuffer(file);

    } catch (error) {

      console.error('Error uploading file:', error);
    }
  }

  render() {
    return (
      <div id="content">
        <h1>Add Report</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.name.value
          const date = this.date.value
          const fileURL = this.state.fileURL;

          const loc = this.fileInput.current.files[0];

          this.props.createReport(name, date, fileURL);
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="name"
              type="text"
              ref={(input) => { this.name = input }}
              className="form-control"
              placeholder="Test Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="date"
              type="text"
              ref={(input) => { this.date = input }}
              className="form-control"
              placeholder="Date"
              required />
          </div>

          <div className="form-group mr-sm-2">
            <input
              id="loc"
              type="file"
              ref={this.fileInput} onChange={this.handleUploadToIPFS}
              className="form-control"
              placeholder="Location"
              required />
          </div>


          <button type="submit" className="btn btn-primary">Add Report</button>
        </form>
        <p>&nbsp;</p>
        <h2>Report List</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Date</th>
              <th scope="col">Patient Id</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            {this.props.reports.map((report, key) => {
              return (
                <tr key={key}>
                  <th scope="row">{report.id.toString()}</th>
                  <td>{report.test_name}</td>
                  <td>{report.date}</td>
                  <td>{report.patient}</td>
                  <td>
                  <button
                      onClick={(event) => {
                        window.open(report.fileURL, '_blank');
                      }}
                    >
                      Show Report
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
