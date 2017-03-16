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
    btn.addEventListener("click", function (event) {
        event.preventDefault();
    });

    // Select the modal
    var modal = document.querySelector('#modal');
    var span = document.querySelector(".close");

    // Open the modal
    btn.onclick = function () {
        modal.style.display = "block";
    };

    // Close the modal
    span.onclick = function () {
        modal.style.display = "none";
    };

    // Close the modal on exterior click
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    function showFailureMessage() {
        $("#failure-message").css("display", "table");
    }

    $(".close-message").bind("click", function () {
        $(this).parent().css('display', 'none');
    });

    /* Add Function
       Stringify the current input data to JSON,
       push the new company to localStorage,
       set successful post to show message after re-rendering.
    */
    function Add() {
        if (operation == "Add") {
            var company = JSON.stringify({
                name: document.querySelector("#nameID").value,
                position: document.querySelector("#positionID").value,
                url: document.querySelector("#urlID").value,
                date: document.querySelector("#dateID").value,
                status: $("#selectID").val(),
                note: document.querySelector("#noteID").value
            });
            table.push(company);
            localStorage.successfulAdd = "1";
            localStorage.setItem("table", JSON.stringify(table));
            return true;
        } else {
            showFailureMessage();
        }
    }

    /*  Update Function
        Get the current information,
        put it back into the form,
        reset the operation to default => Add.
    */
    function Update() {
        table[curIndex] = JSON.stringify({
            name: document.querySelector("#nameID").value,
            position: document.querySelector("#positionID").value,
            url: document.querySelector("#urlID").value,
            date: document.querySelector("#dateID").value,
            status: $('#selectID option:selected').text(),
            note: document.querySelector("#noteID").value
        });
        localStorage.setItem("table", JSON.stringify(table));
        localStorage.successfulUpdate = "1";
        operation = "Add";
        location.reload();
        return true;
    }

    /*  Delete Function
        Get the selected item in the table,
        delete it from the table,
        notify success or failure.
    */
    function Delete() {
        table.splice(curIndex, 1);
        localStorage.setItem("table", JSON.stringify(table));
        localStorage.successfulDelete = "1";
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
            "<tr>" + "<th></th>" + "<th>Name</th>" + "<th>Position</th>" + "<th>Date</th>" + "<th>Status</th>" + "<th>Notes</th>" + "</tr></thead>" + "<tbody id='table-body'>" + "</tbody>");
        for (var i in table) {
            var company = JSON.parse(table[i]);
            $("#table-body").append(
                "<tr>" +
                "<td style='text-align: center;'><img src='edit-pencil.png' alt='Edit" + i + "' class='updateButton'/><img src='delete.png' alt='Delete" + i + "' class='deleteButton'/></td>" +
                "<td>" + company.name + "</td>" +
                "<td><a href=" + company.url + " target='_blank'>" + company.position + "</a></td>" +
                "<td>" + company.date + "</td>" +
                "<td>" + company.status + "</td>" +
                "<td>" + company.note + "</td>" + "</tr>");
        }
    }

    /* Bind submit to the form,
       handle which operation to do.
    */
    $('#form').bind("submit", function () {
        if (operation == "Add") {
            return Add();
        } else {
            return Update();
        }
    });

    /* Check for item in localStorage to
       display success/failure message, 
       then delete it from localStorage.
       ==> brute forcing because of localStorage window reload.
    */
    if ("successfulAdd" in localStorage) {
        $("#success-message-add").css('display', 'table');
            delete localStorage.successfulAdd;
    }
    
    if ("successfulUpdate" in localStorage) {
        $("#success-message-update").css('display', 'table');
        delete localStorage.successfulUpdate;
    }
    
    if ("successfulDelete" in localStorage) {
        $("#success-message-delete").css('display', 'table');
        curIndex = -1;
        delete localStorage.successfulDelete;
    }
    
    showTable();

    /* Bind to Update
       Change operation and put
       the data back in the form.
    */
    $('.updateButton').bind("click", function () {
        operation = "Update";
        curIndex = parseInt($(this).attr("alt").replace("Edit", ""));
        var company = JSON.parse(table[curIndex]);
        document.querySelector("#nameID").value = company.name;
        document.querySelector("#positionID").value = company.position;
        document.querySelector("#urlID").value = company.url;
        document.querySelector("#dateID").value = company.date;
        $('#selectID').val(company.status);
        document.querySelector("#noteID").value = company.note;
    });

    /* Bind to Delete
       Must reload the table and the
       page to get success message.
    */
    $('.deleteButton').bind("click", function () {
        curIndex = parseInt($(this).attr("alt").replace("Delete", ""));
        Delete();
        showTable();
        location.reload();
    });
});