# Front End challenge: “Exoplanets”

Your challenge is to develop a small web app that allows a user to visualize all know
Exoplanets in a table format. We want to test your ability to work with chart library of your
choice, and also understand your intuition/experience with data presentation.

### You will have to use NASA’s API to fetch the data:
(https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=cumulative&format=json)
There is a lot of data so you will need to use virtualization. Please take a look at this library
and examples: (https://react-window.now.sh/#/examples/grid/fixed-size)

### Here are the columns a user might be interested in:
`kepid`
`kepler_name`
`koi_score`
`koi_period`
`ra_str`
`koi_kepmag`

## Requirements:
- Your must use React for the website
- The Table must be able to sort the data both ascending and descending on these fields:
`kepler_name`, `koi_score`
- The table must be virtualized using `react-window` or any other library or custom solution you
would like. The user experience needs to be smooth as you scroll or sort

## Stretch Goal (optional):
If you want to do more, here is another challenge.
Create a Scatterplot that plots the radius ratio to planetary radius