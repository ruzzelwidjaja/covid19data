// Add commas to seperate thousands
function commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Generate dropdown menu for week numbers
function vax() {


    var parsedvaccine;
    
    // Code to load JSON data taken from week 7 tutorials 
    var xmlhttp1 = new XMLHttpRequest();
    var url = "https://services-eu1.arcgis.com/z6bHNio59iTqqSUY/arcgis/rest/services/COVID19_Weekly_Vaccination_Figures/FeatureServer/0/query?where=1%3D1&outFields=Week,TotalweeklyVaccines,Male,Female,Moderna,Pfizer,Janssen,AstraZeneca,Fully_Age10to19,Fully_Age20to29,Fully_Age30to39,Fully_Age40to49,Fully_Age50to59,Fully_Age60to69,Fully_Age70to79,Fully_Age80_,Fully_NA,FullyCum_Age10to19,FullyCum_Age20to29,FullyCum_Age30to39,FullyCum_Age40to49,FullyCum_Age50to59,FullyCum_Age60to69,FullyCum_Age70to79,FullyCum_80_,FullyCum_NA,FullyPer_Age10to19,FullyPer_Age20to29,FullyPer_Age30to39,FullyPer_Age40to49,FullyPer_Age50to59,FullyPer_Age60to69,FullyPer_Age70to79,FullyPer_80_,NA&returnGeometry=false&outSR=4326&f=json";   

    xmlhttp1.onreadystatechange = function() {
        if (xmlhttp1.readyState == 4 && xmlhttp1.status == 200) {
            
            //Parse the JSON data to a JavaScript variable. 
            parsedvaccine = JSON.parse(xmlhttp1.responseText);
            var vaxfeatures = parsedvaccine.features;

            // Dropdown list for weeks
            var dropdown = ""
            for (i = vaxfeatures.length - 1; i >= 1; i--) {
                var weeknum = vaxfeatures[i].attributes.Week
                dropdown += "<option value=" + weeknum + ">" + weeknum + "</option>"
            }
            document.getElementById("weekdropdown").innerHTML = dropdown

            vax2()
        }
    };

    xmlhttp1.open("GET", url, true);
    xmlhttp1.send(); 

}

// Function to show weekly vaccination information and cumulative vaccination amount
function vax2() {
    // Parse JSON Data
    var parsedvaccine;
        
    var xmlhttp1 = new XMLHttpRequest();
    var url = "https://services-eu1.arcgis.com/z6bHNio59iTqqSUY/arcgis/rest/services/COVID19_Weekly_Vaccination_Figures/FeatureServer/0/query?where=1%3D1&outFields=Week,TotalweeklyVaccines,Male,Female,Moderna,Pfizer,Janssen,AstraZeneca,Fully_Age10to19,Fully_Age20to29,Fully_Age30to39,Fully_Age40to49,Fully_Age50to59,Fully_Age60to69,Fully_Age70to79,Fully_Age80_,Fully_NA,FullyCum_Age10to19,FullyCum_Age20to29,FullyCum_Age30to39,FullyCum_Age40to49,FullyCum_Age50to59,FullyCum_Age60to69,FullyCum_Age70to79,FullyCum_80_,FullyCum_NA,FullyPer_Age10to19,FullyPer_Age20to29,FullyPer_Age30to39,FullyPer_Age40to49,FullyPer_Age50to59,FullyPer_Age60to69,FullyPer_Age70to79,FullyPer_80_,NA&returnGeometry=false&outSR=4326&f=json";   

    xmlhttp1.onreadystatechange = function() {
        if (xmlhttp1.readyState == 4 && xmlhttp1.status == 200) {
            
            //Parse the JSON data to a JavaScript variable. 
            parsedvaccine = JSON.parse(xmlhttp1.responseText);
            var vaxfeatures = parsedvaccine.features;
            var selected_week = document.getElementById("weekdropdown").value

            var weeks = []
            for (x=0; x < vaxfeatures.length; x++) {
                var week_num = vaxfeatures[x].attributes.Week
                weeks.push(week_num);
            }
            var week_index = weeks.indexOf(selected_week);

            vax_data(vaxfeatures, week_index)
            age_table(vaxfeatures, week_index)
        }
    }
    xmlhttp1.open("GET", url, true);
    xmlhttp1.send();

    // Show weekly vaccination data
    function vax_data(vaxfeatures, week_index) {

        // Show total cumulative vaccinations and total weekly vaccinations
        var total_vax = 0
        // cwa = current week attribute
        var cwa = vaxfeatures[week_index].attributes
        total_vax += cwa.FullyCum_80_ + cwa.FullyCum_Age10to19 + cwa.FullyCum_Age20to29 + cwa.FullyCum_Age30to39 + cwa.FullyCum_Age40to49 + cwa.FullyCum_Age50to59 + cwa.FullyCum_Age60to69 + cwa.FullyCum_Age70to79 + cwa.FullyCum_NA
        var totvaxweekly = vaxfeatures[week_index].attributes.TotalweeklyVaccines
        var num = total_vax / 5013094 * 100
        var ireland = "(" + num.toFixed(2) + "%)"
        // total vax administered
        var totvax = 0
        var cwa1 = vaxfeatures[week_index].attributes
        for (y=0; y < week_index; y++) {
            var cwa1 = vaxfeatures[week_index].attributes
            totvax += cwa1.TotalweeklyVaccines
        }
        document.getElementById("totalvax").innerHTML = commas(total_vax)
        document.getElementById("ireland").innerHTML = ireland
        document.getElementById("totalvaxweekly").innerHTML = commas(totvax) + 
        "<span style='font-weight:bold; color:#7A66EE'> | </span>" + commas(totvaxweekly)

        // Show table for each weekly vaccinination brand administered
        table = "<table cellpadding=10>";
        table += ""
        table += "<tr align=center>" +
        "<th>Vaccine</th>" +
        "<th>Moderna</th>" + 
        "<th>Pfizer</th>" + 
        "<th>Janssen</th>" + 
        "<th>Astra Zeneca</th></tr>" + 
        "<tr><th>Vaccines Administered</th>"
        
        var attr = vaxfeatures[week_index].attributes
        var vaxweek = [attr.Moderna, attr.Pfizer, attr.Janssen, attr.AstraZeneca]
        for (j = 0; j < vaxweek.length; j++) {
            table += "<td>" + commas(vaxweek[j]) + "</td>"
        }
        
        table += "</tr></table>"

        document.getElementById("weeklytable").innerHTML = table
    }

    function age_table(vaxfeatures, week_index) {
        // Show weekly table data per age group
        // Show data as a total number or a percentage
        var cwa = vaxfeatures[week_index].attributes
        var cumorperc = document.getElementById("cumperc").value;
        var table_age = "<table cellpadding=10>" + 
        "<tr align=center>" + 
        "<th>Age Group</th>" +
        "<th>10 - 19</th>" + 
        "<th>20 - 29</th>" + 
        "<th>30 - 39</th>" + 
        "<th>40 - 49</th>" + 
        "<th>50 - 59</th>" + 
        "<th>60 - 69</th>" + 
        "<th>70 - 79</th>" + 
        "<th>80></th>" + 
        "</tr><tr>" + 
        "<th>Vaccines Administered</th>"
        if (cumorperc === "num") {
            currweekage = [cwa.FullyCum_Age10to19, cwa.FullyCum_Age20to29, 
                cwa.FullyCum_Age30to39, cwa.FullyCum_Age40to49, cwa.FullyCum_Age50to59, 
                cwa.FullyCum_Age60to69, cwa.FullyCum_Age70to79, cwa.FullyCum_80_]
            // Add data to table
            for (j = 0; j < currweekage.length; j++) {
                table_age += "<td>" + commas(currweekage[j]) + "</td>"
            }
        } else {
            currweekage = [cwa.FullyPer_Age10to19, cwa.FullyPer_Age20to29, 
                cwa.FullyPer_Age30to39, cwa.FullyPer_Age40to49, cwa.FullyPer_Age50to59, 
                cwa.FullyPer_Age60to69,cwa.FullyPer_Age70to79, cwa.FullyPer_80_]
            // Add data to table
            for (j = 0; j < currweekage.length; j++) {
                table_age += "<td>" + Math.round(currweekage[j] * 100) + "% </td>"
            }
        }

        table_age += "</tr></table>"
        document.getElementById("agetable").innerHTML = table_age
    }


}

function county() {
    // Parse JSON Data
    var parsedcounty;

    var xmlhttp2 = new XMLHttpRequest();
    var url = "https://services1.arcgis.com/eNO7HHeQ3rUcBllm/arcgis/rest/services/Covid19CountyStatisticsHPSCIrelandOpenData/FeatureServer/0/query?where=1%3D1&outFields=CountyName,PopulationCensus16,PopulationProportionCovidCases,ConfirmedCovidCases&returnGeometry=false&outSR=4326&f=json";   

    xmlhttp2.onreadystatechange = function() {
        if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
            
            //Parse the JSON data to a JavaScript variable. 
            parsedcounty = JSON.parse(xmlhttp2.responseText);
            countyfeatures = parsedcounty.features;  

            highlow(countyfeatures)
        }
    };

    xmlhttp2.open("GET", url, true);
    xmlhttp2.send();
    
    // Function to display Covid-19 data
    function highlow(countyfeatures) {
        // County with highest covid rate per 100k people
        // Highest rate
        var highest_county = ""
        var highest_prop = 0
        for (k = 1; k < countyfeatures.length; k++) {
            var attr = countyfeatures[k].attributes
            var prop = attr.PopulationProportionCovidCases
            if (prop > highest_prop) {
                highest_prop = prop
                highest_county = attr.CountyName
            }
        }
        var high = Math.round(highest_prop) 
        var highest_text = "<span style='color:crimson'><b><u>" + highest_county + "</u></b></span>" 
        + " has the " + "<span style='color:crimson'<b><u>highest</u></b></span>" 
        + " Covid-19 rate with " +
        "<span style='color:crimson'><b><u>" + commas(high) + "</u></b></span>"
        + " cases per 100,000 people"
        document.getElementById("highest").innerHTML = highest_text

        // Lowest rate
        var lowest_county = ""
        var lowest_prop = countyfeatures[0].attributes.PopulationProportionCovidCases
        for (l = 1; l < countyfeatures.length; l++) {
            var attr1 = countyfeatures[l].attributes
            var prop1 = attr1.PopulationProportionCovidCases
            if (prop1 < lowest_prop) {
                lowest_prop = prop1
                lowest_county = attr.CountyName
            }
        }
        var low = Math.round(lowest_prop)
        var lowest_text = "<span style='color:darkseagreen'><b><u>" + lowest_county + "</u></b></span>" 
        + " has the " + "<span style='color:darkseagreen'<b><u>lowest</u></b></span>" 
        + " Covid-19 rate with " + 
        "<span style='color:darkseagreen'><b><u>" +  commas(low) + "</u></b></span>" 
        + " cases per 100,000 people"
        document.getElementById("lowest").innerHTML = lowest_text

        // Make dropdown list
        var dropdown = "<option value=''></option>"
        for (x=1; x < 26; x++) {
            var countyname = countyfeatures[x].attributes.CountyName
            dropdown += "<option value=" + countyname + ">" + countyname + "</option>"
        }
        document.getElementById("select_county").innerHTML = dropdown
        document.getElementById("select_county2").innerHTML = dropdown
        document.getElementById("select_county3").innerHTML = dropdown

    }
    
}

// Show Covid-19 Data per county
// "Show Data" button runs this function as well
function countydata() {
    // Parse JSON Data
    var parsedcounty;

    var xmlhttp2 = new XMLHttpRequest();
    var url = "https://services1.arcgis.com/eNO7HHeQ3rUcBllm/arcgis/rest/services/Covid19CountyStatisticsHPSCIrelandOpenData/FeatureServer/0/query?where=1%3D1&outFields=CountyName,PopulationCensus16,PopulationProportionCovidCases,ConfirmedCovidCases&returnGeometry=false&outSR=4326&f=json";   

    xmlhttp2.onreadystatechange = function() {
        if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
            
            //Parse the JSON data to a JavaScript variable. 
            parsedcounty = JSON.parse(xmlhttp2.responseText);
            
            // List of selected county values
            countyfeatures = parsedcounty.features;  
            var counties_selected = []
            var selected_value = document.getElementById("select_county").value;
            var selected_value2 = document.getElementById("select_county2").value;
            var selected_value3 = document.getElementById("select_county3").value;
            counties_selected.push(selected_value, selected_value2, selected_value3)
            display_county(countyfeatures, counties_selected)
        }
    };

    xmlhttp2.open("GET", url, true);
    xmlhttp2.send();
    
    // Function to display and compare counties selected from dropdown menu
    function display_county(countyfeatures, counties_selected) {        
        // Make array of counties available in JSON data
        var counties = []
        for (x=1; x < countyfeatures.length; x++) {
            var countyname = countyfeatures[x].attributes.CountyName
            counties.push(countyname);
        }
        // Table for counties data
        var data = "<table cellpadding=10>" + 
        "<caption class='countytable'>Covid-19 Data per County</caption>" + 
        "<tr align=center>" + 
        "<th>County</th>" +
        "<th>Population</th>" + 
        "<th>Cases</th>" + 
        "<th>Percentage</th>" + 
        "<th>Proportion per 100,000</th>" +
        "</tr>"
        
        // Fill the table with data 
        for (i=0; i < counties_selected.length; i++) {
            var county_index = counties.indexOf(counties_selected[i]) + 1;
            var attr = countyfeatures[county_index].attributes;
            var perc = attr.ConfirmedCovidCases / attr.PopulationCensus16 * 100
            var pop = Math.round(attr.PopulationProportionCovidCases)

            if (!counties_selected[i]) { // If not an empty string ((""), null, undefined, false and the numbers 0 and NaN)
            } else {
                data += "<tr>" + 
                "<td>" + attr.CountyName + "</td>" +
                "<td>" + commas(attr.PopulationCensus16) + "</td>" +
                "<td>" + commas(attr.ConfirmedCovidCases) + "</td>" +
                "<td>" + perc.toFixed(2) + "%" + "</td>" +
                "<td>" + commas(pop) + "</td>" +
                "</tr>"
            }
        }
        document.getElementById("countydata").innerHTML = data

    }
}


vax()

county()