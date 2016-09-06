import React    from 'react';
import ReactDOM from 'react-dom';
import jsyaml   from 'js-yaml';
import get      from './xhr-get.js';

const currentYear = (new Date).getFullYear();

let years = [currentYear, currentYear + 1].map(year => {
    return get(`events/${year}.yml`)
        .then(resp => jsyaml.safeLoad(resp))
        .catch(err => []);
});

const tableCols   = ['quand', 'quoi', 'ou', 'depart', 'combien'];

const EventList = React.createClass({
    renderMonth: function (date) {
        return <tr key={date.toString()}><td colSpan={tableCols.length}>Mois numéro {date.getMonth() + 1}</td></tr>;
    },
    renderEvent: function (event) {
        let cols = tableCols.map(col => {
            let value = event[col];
            switch (col) {
                case 'quand':
                    return <td key={col}>{event.quand.toLocaleDateString()}</td>;
                case 'quoi':
                    if (event.lien)
                        return <td key={col}><a href={event.lien}>{event.quoi}</a></td>;
                case 'ou':
                    if (event.gps)
                        return <td key={col}><a href={`https://www.openstreetmap.org/search?query=${event.gps}`}>{event.ou}</a></td>;

                default:
                    return <td key={col}>{value}</td>
            }
        });

        return <tr key={event.quand + event.quoi}>{cols}</tr>;
    },
    render: function() {
        let rows      = [];
        let prevMonth = -1;
        this.props.events.forEach(event => {
            let currentMonth = event.quand.getMonth();

            if (currentMonth !== prevMonth) {
                rows.push(this.renderMonth(event.quand));
            }

            rows.push(this.renderEvent(event));
            prevMonth = currentMonth;
        });

        return <table>
            <thead>
                <tr>
                    <th>Quand ?</th>
                    <th>Quoi ?</th>
                    <th>Où ?</th>
                    <th>Départ ?</th>
                    <th>Combien ?</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>;
    }
});

const EventApp = React.createClass({
    componentWillMount: function () {
        Promise.all(years).then(resp => {
            this.setState({
                events: resp.reduce((current, next) => current.concat(next))
            });
        });
    },
    getInitialState: function() {
        return {
            events: []
        };
    },
    render: function() {
        return <EventList events={this.state.events} />;
    }
});

ReactDOM.render(<EventApp/>, document.querySelector('#main'));
