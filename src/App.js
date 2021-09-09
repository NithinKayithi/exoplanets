import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useTable, useBlockLayout, useSortBy } from "react-table";
import Loader from "react-loader-spinner";
import Chart from "react-google-charts";
import { FixedSizeList } from "react-window";
import scrollbarWidth from "./scrollbarWidth";

const Styles = styled.div`
  padding: 1rem;

  .table {
    display: inline-block;
    border-spacing: 0;
    border: 1px solid black;

    .tr {
      :last-child {
        .td {
          border-bottom: 0;
        }
      }
    }

    .th,
    .td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 1px solid black;
      }
    }
  }
  .loader{
    width: 100px;
	  height: 100px;
	
	  position: absolute;
	  top:0;
	  bottom: 0;
	  left: 0;
	  right: 0;
  	
	 margin: auto;
  }
`;

function Table({ columns, data }) {

  const defaultColumn = React.useMemo(
    () => ({
      width: 150,
    }),
    []
  );

  const scrollBarSize = React.useMemo(() => scrollbarWidth(), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    totalColumnsWidth,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useBlockLayout,
    useSortBy
  );

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index]
      prepareRow(row)
      return (
        <div
          {...row.getRowProps({
            style,
          })}
          className="tr"
        >
          {row.cells.map(cell => {
            return (
              <div {...cell.getCellProps()} className="td">
                {cell.render('Cell')}
              </div>
            )
          })}
        </div>
      );
    },
    [prepareRow, rows]
  );

  return (
    <div {...getTableProps()} className="table">
      <div>
        {headerGroups.map(headerGroup => (
          <div {...headerGroup.getHeaderGroupProps()} className="tr">
            {headerGroup.headers.map(column => (
              <div {...column.getHeaderProps(column.id === 'kepler_name' || column.id === 'koi_score' ? column.getSortByToggleProps() : '')} className="th">
                {column.render('Header')}
                <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                    : ''}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div {...getTableBodyProps()}>
        <FixedSizeList
        height={400}
        itemCount={rows.length}
        itemSize={35}
        width={totalColumnsWidth+scrollBarSize}
        >
          {RenderRow}
        </FixedSizeList>
      </div>
    </div>
  );

}

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=cumulative&format=json`)
      .then(res => {
        const data = res.data;
        setData(data);
      })

  }, []);
  const columns = React.useMemo(
    () => [
      {
        Header: 'KepId',
        accessor: 'kepid'
      },
      {
        Header: 'Kepler Name',
        accessor: 'kepler_name'
      },
      {
        Header: 'Koi Score',
        accessor: 'koi_score'
      },
      {
        Header: 'Koi Period',
        accessor: 'koi_period'
      },
      {
        Header: 'Ra Str',
        accessor: 'ra_str'
      },
      {
        Header: 'Koi Kepmag',
        accessor: 'koi_kepmag'
      }
    ],
    []
  );


  const ScatterChartData=[['Radius Ratio','Planetary Radius']];
  let x = 0;
  while (x < data.length) {
    ScatterChartData.push([Number(data[x]['koi_srad']/data[x]['koi_prad']).toFixed(3), data[x]['koi_prad']]);
    x++;
  }
  return (
    <Styles>
      {data.length ? <>
        <h2>Exoplanets:</h2>
        <Table columns={columns} data={data} />
        <h2>Chart:</h2>
        <Chart
          width={'600px'}
          height={'400px'}
          chartType="ScatterChart"
          loader={<div>Loading Chart</div>}
          data={ScatterChartData}
          options={{
            title: 'Radius Ratio vs Planetary radius',
            hAxis: { title: 'Radius Ratio', minValue: 0.0005, maxValue: 15 },
            vAxis: { title: 'Planetary Radius', minValue: 0.00005, maxValue: 15 },
            legend: 'none',
          }}
          rootProps={{ 'data-testid': '1' }}
        />
      </> : ''}
      <div className="loader">
        {!data.length && <Loader
          type="Puff"
          color="#00BFFF"
          height={100}
          width={100}
        />}
      </div>
    </Styles>
  );
}

export default App;
