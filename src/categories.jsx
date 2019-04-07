// External dependencies
import React from "react";
import CategoryList from "./category-list";
import LoadingIcon from "./loading-icon.gif";


class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFlushed: false,
      posts: [],
      category: "",
      page: 0,
      getPostsInCat: true,
      controller: false
    };
    this.getMorePostsInCat = this.getMorePostsInCat.bind(this);
  }

  componentWillUnmount() {
    this.getMorePostsInCat = null;
    console.log("unmount categories", this.getMorePostsInCat);
  }

  componentDidMount() {
    console.log("mount categories", this.props.match);
    //console.log("params", this.props.match.params);

    
    window.onbeforeunload = function() {
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
        if (this.state.getPostsInCat && this.getMorePostsInCat !== null) {
          this.getMorePostsInCat();
        }
      });
  }

  getMorePostsInCat() {
    let url = window.location.href.split("/");
    let slug = url.pop() || url.pop();
    let totalPages;

    this.setState({
      page: this.state.page + 1,
      category: slug
     });

    console.log("get more posts of: ", this.state.category, this.state.page);

    //fetch(PrimitiveSettings.URL.api + "posts?filter[taxonomy]=category&filter[term]=philosophy&page=" + this.state.page)
    fetch("https://nice2b.me/wp-json/wp/v2/posts/?filter[taxonomy]=category&filter[term]=" + this.state.category + "&page=" + this.state.page)
      .then(response => {
        console.log("response", response);
        for (const pair of response.headers.entries()) {
          // getting the total number of pages
          if (pair[0] == "x-wp-totalpages") {
            totalPages = pair[1];
            console.log("totalPages", totalPages);
          }

          if (this.state.page >= totalPages) {
            this.setState({ getPostsInCat: false });
          }
        }
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(results => {
        const allPostsInCat = this.state.posts.slice();
        results.forEach(single => {
          allPostsInCat.push(single);
        });
        this.setState({ posts: allPostsInCat });
      })
      .catch(error => {
        console.log(
          "There was a problem with your fetch categories operation: " + error.message
        );
      });
  }

  componentDidUpdate() {
    // use ScrollMagic for infinite scrolling
    const FadeInController = new ScrollMagic.Controller();
    document
      .querySelectorAll(".posts-container .col-md-4.card-outer")
      .forEach(function(item) {
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
      return <img src={LoadingIcon} alt="loader active gif" id="loader" />;
    }
    //console.log("preload", this.state.posts);
    return (
      <div>
        <div className="container">
          <h1 className="posts-title">Posts by Category: {this.state.category}</h1>
          <CategoryList posts={this.state.posts} />
        </div>
      </div>
    );
  }
}

export default Categories