(async function() {
    // fetch graph data from the server
    const response = await fetch('/graph');
    const data = await response.json();

    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select('#graph')
        .attr('viewBox', [0, 0, width, height])
        .call(d3.zoom().on('zoom', ({transform}) => {
            g.attr('transform', transform);
        }));

    const g = svg.append('g');

    const link = g.append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(data.links)
        .enter().append('line')
        .attr('class', 'link')
        .attr('stroke-width', d => Math.sqrt(d.value));

    const node = g.append('g')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        .data(data.nodes)
        .enter().append('circle')
        .attr('class', 'node')
        .attr('r', 5)
        .attr('fill', '#69b3a2')
        .call(drag(simulation));

    node.append('title').text(d => d.id);

    node.on('mouseover', function(event, d) {
        d3.select(this).classed('highlight', true);
        link.filter(l => l.source.id === d.id || l.target.id === d.id)
            .classed('highlight', true);
    }).on('mouseout', function(event, d) {
        d3.select(this).classed('highlight', false);
        link.classed('highlight', false);
    });

    const simulation = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink(data.links).id(d => d.id))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(width / 2, height / 2));

    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
    });

    function drag(sim) {
        function dragstarted(event) {
            if (!event.active) sim.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) sim.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    }
})();
