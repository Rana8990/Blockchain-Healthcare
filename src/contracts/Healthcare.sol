// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; //Solidity version

contract Healthcare {
    string public name;
    
    uint public reportCount = 0 ;
    mapping(uint => Report) public reports;

    struct Report {
        uint id;
        string test_name;
        string date;
        string fileURL;
        address patient;
    }

    event ReportCreated(
        uint id,
        string test_name,
        string date,
        string fileURL,
        address patient
    );

    constructor() {
        name = "Healthcare name test";
    }

    function createReport(string memory _test_name, string memory _date, string memory _url) public {
        // Require a valid name
        require(bytes(_test_name).length > 0);
        // Increment report count
        reportCount ++;
        // Create the report
        reports[reportCount] = Report(reportCount, _test_name, _date, _url, msg.sender);
        
        emit ReportCreated(reportCount, _test_name, _date, _url, msg.sender);
    }
}