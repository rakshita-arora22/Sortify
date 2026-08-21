import { buildTodaysRoute } from './routeOptimization.js';

   const depot = { lat: 18.5204, lng: 73.8567 };
   const bins = [
     { id: 'b1', lat: 18.5245, lng: 73.8677, fillPercent: 82, wasteType: 'dry', status: 'pending' },
     { id: 'b2', lat: 18.5089, lng: 73.8259, fillPercent: 91, wasteType: 'hazardous', status: 'pending' },
   ];
   const pickupRequests = [
     { id: 'p1', lat: 18.5100, lng: 73.8300, category: 'recyclable', status: 'pending' },
   ];

   const route = buildTodaysRoute({ bins, pickupRequests, depot });
   console.log(route.percentDistanceSaved, '% distance saved');
   console.log(route.smart.orderedStops);