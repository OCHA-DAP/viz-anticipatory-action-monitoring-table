window.$ = window.jQuery = require('jquery');
function hxlProxyToJSON(input){
    var output = [];
    var keys=[]
    input.forEach(function(e,i){
        if(i==0){
            e.forEach(function(e2,i2){
                var parts = e2.split('+');
                var key = parts[0]
                if(parts.length>1){
                    var atts = parts.splice(1,parts.length);
                    atts.sort();                    
                    atts.forEach(function(att){
                        key +='+'+att
                    });
                }
                keys.push(key);
            });
        } else {
            var row = {};
            e.forEach(function(e2,i2){
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
}
$( document ).ready(function() {
  const DATA_URL = 'https://proxy.hxlstandard.org/data.objects.json?dest=data_edit&strip-headers=on&force=on&header-row=1&url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2Fe%2F2PACX-1vSuwMFCg_aLAghw4CzGeL5xpGimXi4k4dFmqpvlIAt4wzZYU8GnmRANLT6dHOZwe0FpFmQ4r_Bd7iyy%2Fpub%3Fgid%3D0%26single%3Dtrue%26output%3Dcsv';
  let isMobile = $(window).width()<600? true : false;

  function getData() {

    d3.json(DATA_URL).then(function(data) {
      const columns = ['Country', 'Shock', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      //console.log(data)
      let items = [];
      for (const item of data) {
        let obj = {};
        let dateRange = item['#date+range'].split(',');

        for (const column of columns) {
          if (column=='Country') {
            obj[column] = item['#country+name'];
          }
          else if (column=='Shock') {
            obj[column] = item['#event+name'];
          }
          else {
            let active = false;
            for (const date of dateRange) {
              if (date==column) active = true;
            }
            obj[column] = active;
          }
        }
        items.push(obj);
      }

      let table = d3.select('.table-container').append('table');
      let headers = table.append('thead').append('tr')
         .selectAll('th')
         .data(columns).enter()
         .append('th')
         .attr('class', function(d) {
            let thClass = (d!=='Country' && d!=='Shock') ? 'monthHeader' : 'header';
            return thClass;
         })
         .text(function (d) {
            return d;
          });
      
      let rows = table.append('tbody').selectAll('tr')
        .data(items).enter()
        .append('tr');
      
      rows.selectAll('td')
        .data(function (d) {
          return columns.map(function (col) {
            //console.log(k)
            return { 'name': col, 'value': d[col] };
          });
        }).enter()
        .append('td')
        .attr('data-th', function (d) {
          return d.name;
        })
        .attr('class', function (d) {
          let hasClass = '';
          if (d.name!=='Country' && d.name!=='Shock') {
            if (d.value) hasClass = 'bg';
          }
          return hasClass;
        })
        .text(function (d) {
          if (d.name=='Country' || d.name=='Shock') {
            return d.value;
          }
        });
    });
  }

  function createTable() {

  }

  function initTracking() {
    //initialize mixpanel
    let MIXPANEL_TOKEN = '';
    mixpanel.init(MIXPANEL_TOKEN);
    mixpanel.track('page view', {
      'page title': document.title,
      'page type': 'datavis'
    });
  }

  getData();
  //initTracking();
});