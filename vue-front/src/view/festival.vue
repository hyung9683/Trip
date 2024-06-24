<template>
  <div id="app" class="container">
    <div class="postion-absolute row justify-content-left">
      <div class="col-12">
        <svg ref="map" class="w-100"></svg>
      </div>
    </div>
    <div class="col-lg-12">
       <span class="mx-1" :key="i" v-for="(item, i) in items">
          {{ item }}
       </span>
    </div> 
  </div>
</template>

<script>
import * as d3 from 'd3';
import KoreaMapData from '../assets/korea.json'; // GeoJSON 데이터를 임포트합니다.

export default {
  name: 'App',
  mounted() {
    this.drawMap();
  },
  methods: {
    drawMap() {
      const width = 500;
      const height = 500;

      const svg = d3.select(this.$refs.map)
        .attr('width', width)
        .attr('height', height);

      const projection = d3.geoMercator()
        .center([127.7669, 35.9078])
        .scale(4000)
        .translate([width / 2, height / 2]);

      const path = d3.geoPath().projection(projection);

      svg.append('g')
        .selectAll('path')
        .data(KoreaMapData.features) // GeoJSON 데이터 사용
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', '#ccc')
        .attr('stroke', '#333')
        .attr('stroke-width', 0.5)
        .on('mouseover', function() {
          d3.select(this).attr('fill', 'orange');
        })
        .on('mouseout', function() {
          d3.select(this).attr('fill', '#ccc');
        })
        .on('click', (event, d) => {
          this.$router.push(`/festival/${d.properties.name}`); // 지역 이름에따라 불러오는 게시글 
        });

      svg.append('g')
        .selectAll('text')
        .data(KoreaMapData.features)
        .enter().append('text')
        .attr('x', d => {
          const centroid = path.centroid(d);
          if (d.properties.name === '경기도') {
            return centroid[0] + 10; // 경기도의 x 좌표를 오른쪽으로 20픽셀 이동
          }
          return centroid[0];
        })
        .attr('y', d => {
          const centroid = path.centroid(d);
          if (d.properties.name === '경기도') {
            return centroid[1] + 20; // 경기도의 y 좌표를 아래로 20픽셀 이동
          }
          if (d.properties.name === '충청남도') {
            return centroid[1] + 10; // 충청남도의 y 좌표를 아래로 10픽셀 이동
          }
          if (d.properties.name === '인천광역시') {
            return centroid[1] - 10; // 인천광역시의 y 좌표를 아래로 -10픽셀 이동
          }
          if (d.properties.name === '충청북도') {
            return centroid[1] - 10; // 충청북도의 y 좌표를 아래로 -10픽셀 이동
          }
          return centroid[1];
        })
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', 'black')
        .text(d => d.properties.name);
    },
    fs_List(){}
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
#app{
  padding-top: 20px;

}
svg {
  boder: 1px solid #ccc;
}
</style>
