import star from './images/star.png';
import star_1 from './images/star-1.png';
import star_2 from './images/star-2.png';
import star_3 from './images/star-3.png';
import './App.css';
import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.css';

const testData1 = [];
const testData2 = [
  {
    "publish_date": "2016-09-05T23:25:47.642350Z",
    "id": "9783221620868",
    "body": "The fool doth think he is wise, but the wise man knows himself to be a fool.",
    "author": "Kaley Schiller"
  },
  {
    "rating": 3.2,
    "id": "9793364045824",
    "body": "Can one desire too much of a good thing?.",
    "author": "Fay Lemke"
  },
  {
    "rating": 4.1,
    "publish_date": "2016-09-03T23:25:47.642545Z",
    "id": "9784620626604",
    "body": "How bitter a thing it is to look into happiness through another man's eyes! How bitter a thing it is to look into happiness through another man's eyes! How bitter a thing it is to look into happiness through another man's eyes! How bitter a thing it is to look into happiness through another man's eyes! How bitter a thing it is to look into happiness through another man's eyes! How bitter a thing it is to look into happiness through another man's eyes!",
  }
];
const testData3 = null;

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

const days = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
];

function convertToHTML(reviews) {
  // converts array of reviews to rows show on UI
  return reviews.slice(0, 20).map(rev => (
    <Row key={rev.id} review={rev}/>
  ));
}

class Stars extends Component {
  // set of stars shown near ratings

  lastStar(amt) {
    // decides which partial star to use
    if (amt >= 0.1 && amt < .35) {
      return <img className="star star-1" key={this.props.id + '-last'} src={star_1} alt="star"/>
    } else if (amt >= 0.35 && amt < .6) {
      return<img className="star star-2" key={this.props.id + '-last'} src={star_2} alt="star1"/>
    } else if (amt >= 0.6 && amt <= .9) {
      return <img className="star star-3" key={this.props.id + '-last'} src={star_3} alt="star2"/>
    } else if (amt > 0.9) {
      return <img className="star" key={this.props.id + '-last'} src={star} alt="star3"/>
    }
  }

  render() {
    let stars = this.props.stars;
    var star_images = [];

    let percent = stars % 1;
    let whole = stars - percent;

    // creates star image combos to show on the frontend
    for (var i = 0; i < whole; i++) {
      star_images.push(<img className="star" key={this.props.id + '-' + i} src={star} alt="star"/>)
    }
    
    if (percent >= 0.1) {
      star_images.push(this.lastStar(percent));
    }

    return (
      <div className="star-container">
        {star_images}
      </div>
    )
  }
}

class SortButton extends Component {
  // button that is used to sort review info
  render() {
    return (
      <button className="sort-button" onClick={this.props.func}>{this.props.label}</button>
    )
  }
}

class Row extends Component {
  // row that shows info about a review
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleClick(id) {
    // hide or show the body content of a review
    let elem = document.getElementById('acc-' + id);
    if (elem.style.display === 'none') {
      elem.style.display = 'block';
    } else {
      elem.style.display = 'none';
    }
  }

  render() {
    let rev = this.props.review;
    var d = rev.publish_date ? new Date(rev.publish_date) : '-';
    return (
      <div>
        <div className="row-content" onClick={this.handleClick.bind(this, rev.id)}>
          <div className="review-box">{rev.rating ? <div className="rating"><span className="rating-text">{rev.rating}</span> <Stars stars={rev.rating} key={rev.id}/></div> : '-'}</div>
          <div>{rev.author ? rev.author : '-'}</div>
          <div className="review-date">{d !== '-' ? (days[d.getDay()] + ' - ' + months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear()) : d}</div>
        </div>
        {rev.body ? 
        <div className="row-content gray-text" id={'acc-' + + rev.id} style={{display: 'none'}}>
          {rev.body}
        </div> : null}
      </div>
    )
  }
}

class Container extends Component {
  // container for all rows and content
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      reviews: [], // review data returned
      thisPageReviews: [], //review data shown on page
      pageCount: 0, // # of pages needed to show all info
      offset: 0, // offset of reviews, used to show certain reviews on certain pages
      perPage: 20, // # of reviews per page
      currentPage: 0, // page you are on
      average: '-', // average rating of reviews
      highest: '-', // highest rating in reviews
      lowest: '-', // lowest rating in reviews
    };
  }

  componentDidMount() {
    // happens after UI is loaded
    fetch("https://shakespeare.podium.com/api/reviews", { headers: { 'x-api-key': 'H3TM28wjL8R4#HTnqk?c' }})
      .then(res => res.json())
      .then(
        (result) => {

          // Tests for bad data
          // *********************************** TEST 1 ***********************************
          // result = testData1

          // *********************************** TEST 2 ***********************************
          // result = testData2

          // *********************************** TEST 3 ***********************************
          // result = testData3

          result = result ? result : [];
          let count = result.length ? result.length : 0;
          let cleanResult = result.filter(a => a.rating);
          // sets initial values in state
          this.setState({
            isLoaded: true,
            reviews: result,
            pageCount: count ? Math.ceil(count / this.state.perPage) :  0,
            average: cleanResult.length ? Math.round((cleanResult.reduce((a,b) => a + b.rating, 0) / cleanResult.length) * 100) / 100 : '-',
            highest: cleanResult.length ? Math.max.apply(Math, cleanResult.map(function(o) { return o.rating; })) : '-',
            lowest: cleanResult.length ? Math.min.apply(Math, cleanResult.map(function(o) { return o.rating; })) : '-'
          });
          var rows = convertToHTML(result);
          this.setState({ thisPageReviews: rows });
        },
        //  if an error occurs in the call
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  sortReviews(what, arr) {
    // sorts review info based on sort button pushed
    if (what === 'rating lh') {
      arr = arr.sort((a, b) => (a.rating > b.rating) ? 1 : -1)
    } else if (what === 'rating hl') {
      arr = arr.sort((a, b) => (a.rating > b.rating) ? -1 : 1)
    } else if (what === 'date lh') {
      arr = arr.sort((a, b) => (a.publish_date > b.publish_date) ? 1 : -1)
    } else if (what === 'date hl') {
      arr = arr.sort((a, b) => (a.publish_date > b.publish_date) ? -1 : 1)
    } 

    this.setState({
      thisPageReviews: convertToHTML(arr),
      offset: 0,
      currentPage: 0,
    });
  }

  handlePageClick = (data) => {
    // goes to next or previous page
    const selectedPage = data.selected;

    const offset = selectedPage * this.state.perPage;
    this.setState({ currentPage: selectedPage, offset: offset }, () => {
        this.setElementsForCurrentPage();
    });
  }

  setElementsForCurrentPage() {
    // refreshed data for current page
    var rows = convertToHTML(this.state.reviews.slice(this.state.offset, this.state.offset + this.state.perPage)); 

    this.setState({
      thisPageReviews: rows,
    });
  }

  render() {
      let paginationElement;
      if (this.state.pageCount > 1) {
        // creates pagination menu
        paginationElement = (
          <ReactPaginate
            previousLabel={<p className="p-arrow">{"<"}</p>}
            nextLabel={<p className="p-arrow">{">"}</p>}
            breakLabel={<span className="gap">...</span>}
            pageCount={this.state.pageCount}
            onPageChange={this.handlePageClick}
            forcePage={this.state.currentPage}
            containerClassName={"pagination"}
            disabledClassName={"disabled"}
            activeClassName={"active"}
            pageClassName={"page-item "}
            pageLinkClassName={"page-link page-item-point"}
            previousClassName={"previous_page page-item"}
            previousLinkClassName={"previous_page page-link page-item-point"}
            nextClassName={"previous_page page-item"}
            nextLinkClassName={"next_page page-link page-item-point"}
          />
        );
      }

      return (
        <div className="shake-conatiner">
          <div className="state-box-container">
            <div className="state-box">
              <p className="large-header">Average Rating</p>
              <span className="text-spacer">{this.state.average}</span>
              <Stars stars={this.state.average}/>
            </div>
            <div className="state-box">
              <p className="large-header">Highest Rating</p>
              <span className="text-spacer">{this.state.highest}</span>
              <Stars stars={this.state.highest}/>
            </div>
            <div className="state-box">
              <p className="large-header">Lowest Rating</p>
              <span className="text-spacer">{this.state.lowest}</span>
              <Stars stars={this.state.lowest}/>
            </div>
          </div>
          <div className="top-pagination-container">
            <div className="top-pagination">{paginationElement}</div>
          </div>
          <div className="row-container-header">
            Shakepeare's Reviews ({(this.state.reviews.length ? ((this.state.offset + 1) + ' - ') : '') + (this.state.offset + this.state.thisPageReviews.length)})
            <div className="sort-buttons">
              <p className="button-label-text">Sort by: </p>
              <SortButton label={'rating, high - low'} func={this.sortReviews.bind(this, 'rating hl', this.state.reviews)}/>
              <SortButton label={'rating, low - high'} func={this.sortReviews.bind(this, 'rating lh', this.state.reviews)}/>
              <SortButton label={'date, new - old'} func={this.sortReviews.bind(this, 'date hl', this.state.reviews)}/>
              <SortButton label={'date, old - new'} func={this.sortReviews.bind(this, 'date lh', this.state.reviews)}/>
            </div>
          </div>
          <div className="row-conatiner"> 
          {this.state.thisPageReviews.length ? this.state.thisPageReviews : (
            <div className="row-content">
              <div className="review-date"><b>{'No results'}</b></div>
            </div>
          )}
          </div>
          <div className="row-container-end"></div>
        </div>
      );
  }
}

export default Container;