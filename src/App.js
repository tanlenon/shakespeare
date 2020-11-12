import star from './images/star.png';
import star_1 from './images/star-1.png';
import star_2 from './images/star-2.png';
import star_3 from './images/star-3.png';
import './App.css';
import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.css';

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

class Stars extends Component {

  lastStar(amt) {
    if (amt > 0.1 && amt <= .35) {
      return <img className="star star-1" key={this.props.id + '-last'} src={star_1} alt="star"/>
    } else if (amt > 0.35 && amt <= .6) {
      return<img className="star star-2" key={this.props.id + '-last'} src={star_2} alt="star1"/>
    } else if (amt > 0.6 && amt <= .9) {
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

    for (var i = 0; i < whole; i++) {
      star_images.push(<img className="star" key={this.props.id + '-' + i} src={star} alt="star"/>)
    }

    if (percent > 0.1) {
      star_images.push(this.lastStar(percent));
    }

    return (
      <div className="star-container">
        {star_images}
      </div>
    )
  }
}

class Row extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    let rev = this.props.review;
    var d = new Date(rev.publish_date);
    return (
      <div className="row-content">
        <div className="rating"><span className="rating-text">{rev.rating}</span> <Stars stars={rev.rating} key={rev.id}/></div>
        <div>{rev.author}</div>
        <div>{days[d.getDay()] + ' - ' + months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear()}</div>
      </div>
    )
  }
}

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      reviews: [],
      thisPageReviews: [],
      pageCount: 0,
      offset: 0,
      perPage: 20,
      currentPage: 0,
      average: 0,
    };
  }

  componentDidMount() {
    fetch("https://shakespeare.podium.com/api/reviews", { headers: { 'x-api-key': 'H3TM28wjL8R4#HTnqk?c' }})
      .then(res => res.json())
      .then(
        (result) => {
          let count = result.length ? result.length : 0;
          console.log(count,result);
          this.setState({
            isLoaded: true,
            reviews: result,
            number_of_reviews: count,
            reviews_on_page: count,
            pageCount: count ? Math.ceil(count / this.state.perPage) :  0,
            average: Math.round((result.reduce((a,b) => a + b.rating, 0) / result.length) * 100) / 100,
          });
          var rows = result.slice(0, 20).map(rev => (
            <Row key={rev.id} review={rev}/>
          ));
          this.setState({ thisPageReviews: rows });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  handlePageClick = (data) => {
    const selectedPage = data.selected;

    const offset = selectedPage * this.state.perPage;
    this.setState({ currentPage: selectedPage, offset: offset }, () => {
        this.setElementsForCurrentPage();
    });
  }

  setElementsForCurrentPage() {
    var rows = this.state.reviews.slice(this.state.offset, this.state.offset + this.state.perPage).map(rev => (
      <Row key={rev.id} review={rev}/>
    ));
    console.log(rows, this.state.reviews)

    this.setState({
      thisPageReviews: rows,
    });
  }

  render() {
      let paginationElement;
      if (this.state.pageCount > 1) {
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
            <div className="state-box"><p className="large-header">Average Rating</p> {this.state.average}</div>
            <div className="state-box"><p className="large-header">Average Rating</p> {this.state.average}</div>
          </div>
          <div className="top-pagination-container">
            <div className="top-pagination">{paginationElement}</div>
          </div>
          <div className="row-container-header">Shakepeare's Reviews ({(this.state.offset + 1) + ' - ' + (this.state.offset + this.state.thisPageReviews.length)})</div>
          <div className="row-conatiner"> 
          {this.state.thisPageReviews}
          </div>
          <div className="row-container-end"></div>
        </div>
      );
  }
}

export default Container;