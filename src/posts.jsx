import React from "react";
import PostList from "./post-list";
import LoadingIcon from "./loading-icon.gif";
// import PreLoader from "./loader";
//import Loader from 'react-loader-spinner'
import ReactGA from 'react-ga';

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      page: 0,
      getPosts: true,
      controller: false
    };
    this.getMorePosts = this.getMorePosts.bind(this);
  }

  componentWillUnmount() {
    this.getMorePosts = null;
  }

  componentDidMount() {

    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    };

    // init ScrollMagic Controller
    this.controller = new ScrollMagic.Controller();

    // build scene
    const scene = new ScrollMagic.Scene({
      triggerElement: "#footer",
      triggerHook: "onEnter"
    })
      .addTo(this.controller)
      .on("enter", e => {
        if (this.state.getPosts && this.getMorePosts !== null) {
          this.getMorePosts();
        }
      });

    document.title = "Nice2b.me - Posts and Articles";
    ReactGA.pageview(window.location.pathname + window.location.search);
    document.body.className = "";
    document.body.classList.add('blog');
  }

  getMorePosts() {
    let totalPages;

    this.setState({ page: this.state.page + 1 });

    fetch(PrimitiveSettings.URL.api + "posts/?page=" + this.state.page)
      .then(response => {
        for (const pair of response.headers.entries()) {
          // getting the total number of pages
          if (pair[0] == "x-wp-totalpages") {
            totalPages = pair[1];
          }

          if (this.state.page >= totalPages) {
            this.setState({ getPosts: false });
          }
        }
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(results => {
        const allPosts = this.state.posts.slice();
        results.forEach(single => {
          allPosts.push(single);
        });
        this.setState({ posts: allPosts });
      })
      .catch(error => {
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
      });
  }

  componentDidUpdate() {
    // use ScrollMagic for infinite scrolling
    const FadeInController = new ScrollMagic.Controller();
    document
      .querySelectorAll(".posts-container .col-md-4.card-outer")
      .forEach(function (item) {
        // build a scene
        const FadeInScene = new ScrollMagic.Scene({
          triggerElement: item.children[0],
          reverse: false,
          triggerHook: 1
        })
          .setClassToggle(item, "fade-in")
          .addTo(FadeInController);
      });
  }

  render() {
    if (!this.state.posts.length === 0) {
      return (
        <>
          <img src={LoadingIcon} alt="loader gif" className="active" id="loader" />
          <p>No matching posts</p>
        </>
      );
    }
    console.log("this.state.posts", this.state.posts);
    return (
      <div>
        <div className="container">
          <h1 className="posts-title">All Posts &amp; Ramblings</h1>
          <PostList posts={this.state.posts} />
        </div>
      </div>
    );
  }
}

export default Posts;