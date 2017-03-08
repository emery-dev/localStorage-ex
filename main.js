$(document).ready(function () {
    var operation = "Add";
    var curIndex = -1;
    var table = localStorage.getItem("table");
    table = JSON.parse(table);
    if (table === null) {
        table = [];
    }
    
    /* Modal */
    var btn = document.querySelector("#modalButton");
    btn.addEventListener("click", function(event){
        event.preventDefault();
    });

    // Select the modal
    var modal = document.querySelector('#modal');
    var span = document.querySelector(".close");

    // Open the modal
    btn.onclick = function() {
        modal.style.display = "block";
    };

    // Close the modal
    span.onclick = function() {
        modal.style.display = "none";
    };

    // Close the modal on exterior click
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Make div display/hide
    function success(){
        $("#success-message").css("display", "table");
    }

    function failure(){
        $("#failure-message").css("display", "table");
    }

    $(".close-message").bind("click", function(){
        $(this).parent().css('display', 'none');
    });

    function Add() {
        if (operation == "Add") {
            var company = JSON.stringify({
                name: document.querySelector("#nameID").value,
                position: document.querySelector("#positionID").value,
                url: document.querySelector("#urlID").value,
                date: document.querySelector("#dateID").value,
                status: $("#selectID").val()
            });
            table.push(company);
            localStorage.successfulPost = "1";
            localStorage.setItem("table", JSON.stringify(table));
            return true;
        }
    }

    /*  Update Function
        Get the current information,
        put it back into the form,
        reset the operation to default, Add
    */
    function Update() {
        table[curIndex] = JSON.stringify({
            name: document.querySelector("#nameID").value,
            position: document.querySelector("#positionID").value,
            url: document.querySelector("#urlID").value,
            date: document.querySelector("#dateID").value,
            status: $('#selectID option:selected').text()
        });
        localStorage.setItem("table", JSON.stringify(table));
        localStorage.successfulPost = "1";
        operation = "Add";
        alert('Item updated in the table');
        return true;
    }

    function Delete() {
        console.log('curIndex: ' + curIndex);
        table.splice(curIndex, 1);
        localStorage.setItem("table", JSON.stringify(table));
        alert('Deleted company successfully.');
        return true;
    }

    /*  Print the table
        Important to reset html before printing,
        then reading in from localStorage.

    */
    function showTable() {
        $("#table").html = "";
        $("#table").html(
            "<thead>" +
            "<tr>" + "<th></th>" + "<th>Name</th>" + "<th>Position</th>" + "<th>Date</th>" + "<th>Status</th>" + "</tr></thead>" + "<tbody id='table-body'>" + "</tbody>");
        console.log("table: " + table);
        for (var i in table) {
            var company = JSON.parse(table[i]);
            $("#table-body").append(
            "<tr>" +
                "<td style='text-align: center;'><img src='edit-pencil.png' alt='Edit" + i + "' class='updateButton'/><img src='delete.png' alt='Delete" + i + "' class='deleteButton'/></td>" +
                "<td>" + company.name + "</td>" +
                "<td><a href=" + company.url + " target='_blank'>" + company.position + "</a></td>" +
                "<td>" + company.date + "</td>" +
                "<td>" + company.status + "</td>"
            + "</tr>");
        }
    }

    $('#form').bind("submit", function () {
        if (operation == "Add") {
            return Add();
        } else {
            return Update();
        }
    });
    
    //Check for item in localStorage to
    //display success div, then delete it
    //from localStorage
    if ("successfulPost" in localStorage) {
                $("#success-message").css('display', 'table');
                setInterval(function() {
                    delete localStorage.successfulPost;},           
                1000);
    }
    showTable();
    
    //Must define after showing the table because it is in the table
    $('.updateButton').bind("click", function () {
        operation = "Update";
        curIndex = parseInt($(this).attr("alt").replace("Edit", ""));
        var company = JSON.parse(table[curIndex]);
        document.querySelector("#nameID").value = company.name;
        document.querySelector("#positionID").value = company.position;
        document.querySelector("#urlID").value = company.url;
        document.querySelector("#dateID").value = company.date;
        $('#selectID').val(company.status);
    });
    
    $('.deleteButton').on("click", function () {
        console.log('parseInt: ' + parseInt($(this).attr("alt").replace("Delete", "")));
        curIndex = parseInt($(this).attr("alt").replace("Delete", ""));
        console.log(curIndex);
        Delete();
        showTable();
    });
});
