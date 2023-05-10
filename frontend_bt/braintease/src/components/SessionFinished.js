import React from "react";
import { getSet } from "../utils";
import Table from 'react-bootstrap/Table';
import '../css/SessionFinished.css';

export default function SessionFinished({ data }) {

  // Get a list of numbers (rounds).
  const columns = getSet(data.map(card => {
    return card.round
  }));

  const initRound = data.filter(card => card.round === 1);

  let overAllTime = 0;
  const excludeX = data.filter(card => card.time !== 'X');
  excludeX.map(card => {
    return overAllTime += card.time;
  });

  // A list of cards. Each card has a list of rounds.
  const rows = initRound.map(card => {
    const row = data.filter(c => c.card.pk === card.card.pk);
    return row;
  });

  return (
    <div>
      <Table striped hover className="">
        <thead>
          <tr>
            <th></th>
            {columns.map(col => {
              return (
                <th key={col}>Round {col}</th>
              );
            })}
          </tr>
          <tr>
            <th>Card</th>
            <th colSpan={columns.length}>Time</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            return (
              <tr key={i}>
                <td>{row[0].card.title}</td>
                {columns.map((col, i) => {
                  return (
                    <td key={col}>
                      {row[i] === undefined ? null : row[i].time}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <h5>Total Time <b>{overAllTime/100} s</b></h5>
    </div>
  );
}