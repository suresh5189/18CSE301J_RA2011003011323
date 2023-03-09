let countryURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countryData;
let educationData;

let canvas = d3.select("#canvas");
let tooltip = d3.select("#tooltip");

let drawMap = () => {
  canvas
    .selectAll("path")
    .data(countryData)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("fill", (countryDataItem) => {
      let id = countryDataItem["id"];
      let country = educationData.find((item) => {
        return item["fips"] === id;
      });
      let percentage = country["bachelorsOrHigher"];
      if (percentage <= 15) {
        return "#FF6B6B";
      } else if (percentage <= 30) {
        return "#FF3F3D";
      } else if (percentage <= 45) {
        return "#D32431";
      } else {
        return "#6B0000";
      }
    })
    .attr("data-fips", (countryDataItem) => {
      return countryDataItem["id"];
    })
    .attr("data-education", (countryDataItem) => {
      let id = countryDataItem["id"];
      let country = educationData.find((item) => {
        return item["fips"] === id;
      });
      let percentage = country["bachelorsOrHigher"];
      return percentage;
    })
    .on("mouseover", (countryDataItem) => {
      tooltip.transition().style("visibility", "visible");
      let id = countryDataItem["id"];
      let country = educationData.find((item) => {
        return item["fips"] === id;
      });
      tooltip.text(
        country["fips"] +
          " - " +
          country["area_name"] +
          ", " +
          country["state"] +
          " : " +
          country["bachelorsOrHigher"] +
          "%")
          tooltip.attr('data-education', country['bachelorsOrHigher'] )
    })
    .on("mouseout", (countyDataItem) => {
      tooltip.transition().style("visibility", "hidden");
    });
};

d3.json(countryURL).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    countryData = topojson.feature(data, data.objects.counties).features;

    console.log(countryData);

    d3.json(educationURL).then((data, error) => {
      if (error) {
        console.log(error);
      } else {
        educationData = data;
        console.log(educationData);
        drawMap();
      }
    });
  }
});
