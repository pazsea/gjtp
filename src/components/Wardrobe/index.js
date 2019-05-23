import React, { Component, Fragment, useState } from 'react';
import { connect } from 'react-redux';
import Truncate from 'react-truncate';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { Section } from '../../styleConstants/section.js';
import { calculatePoints } from '../../constants/functions';

import * as s from './styles';
import StarRatingComponent from 'react-star-rating-component';
import parfume1 from '../../images/parfume1.jpg';
import Loading from '../Loading';
import NoCollection from '../Recommendation/No-collection';
import noteslogo from '../../images/noteslogo.png';

class WardrobePage extends Component {
  state = {
    isTruncated: false,
    tabOpen: '',
  };

  // componentDidMount() {
  //   const {
  //     authUser: { selectedCol },
  //     myWardrobe,
  //   } = this.props;

  //   this.setState({
  //     loading: false,
  //     myWardrobe,
  //     subscription: selectedCol
  //       ? Object.keys(selectedCol)
  //       : selectedCol,
  //   });
  // }
  // componentDidUpdate(prevProps, prevState) {
  //   if (
  //     prevProps.myWardrobe !== this.props.myWardrobe ||
  //     prevProps.authUser !== this.props.authUser
  //   ) {
  //     this.setState({
  //       myWardrobe: this.props.myWardrobe,
  //       subscription: this.props.authUser.selectedCol
  //         ? Object.keys(this.props.authUser.selectedCol)
  //         : this.props.authUser.selectedCol,
  //     });
  //   }
  // }

  componentWillUnmount() {
    const {
      firebase,
      authUser: { uid },
    } = this.props;
    firebase.wardrobe(uid).off();
  }

  newValue(note, value) {
    const { myWardrobe } = this.props;
    console.log('value ' + value + ' note: ' + note);
    if (myWardrobe) {
      if (myWardrobe.ratedNotes) {
        console.log('INNE I NEW VALUE NOTE ' + note);

        if (myWardrobe.ratedNotes[note]) {
          return parseInt(myWardrobe.ratedNotes[note] + value);
          // if (value > 0) {
          //   const add = parseInt(myWardrobe.ratedNotes[note] + value);
          //   return add;
          // } else if (value < 0) {
          //   const subtract = parseInt(
          //     myWardrobe.ratedNotes[note] + value,
          //   );
          //  return subtract;
          //}
        } else {
          return value;
        }
      } else {
        console.log('hör borde det komma in nåogt ' + value);
        return value;
      }
    } else {
      return value;
    }
  }

  onStarClick(base, heart, top, nextValue, prevValue, name) {
    const {
      firebase,
      authUser: { uid },
    } = this.props;
    console.log('yo' + base + heart + top);
    const clickedPoints = calculatePoints(nextValue, prevValue);

    if (nextValue !== prevValue) {
      const ba = this.newValue(base, clickedPoints);
      console.log('heart: ' + this.newValue(heart, clickedPoints));
      console.log('top: ' + this.newValue(top, clickedPoints));
      firebase
        .wardrobe(uid)
        .child('parfumes')
        .child(name)
        .update({
          rating: nextValue,
          base: [base],
          heart: [heart],
          top: [top],
        })
        .then(
          firebase
            .wardrobe(uid)
            .child('ratedNotes')
            .update({
              [base]: this.newValue(base, clickedPoints),
              [heart]: this.newValue(heart, clickedPoints),
              [top]: this.newValue(top, clickedPoints),
            }),
          // .then(
          //   firebase
          //     .wardrobe(uid)
          //     .child('ratedNotes')
          //     .update({
          //       [base]: ba,
          //     }),
          // ),
        );
    }
  }

  toggleTab = e => {
    const tabValue = e.target.value;
    this.setState({
      tabOpen: tabValue,
    });
  };

  toggleTruncate = () => {
    this.setState(prevState => ({
      isTruncated: !prevState.isTruncated,
    }));
  };

  render() {
    const { tabOpen, isTruncated, loading } = this.state;
    const { authUser, myWardrobe, firebase } = this.props;

    if (loading) {
      return <Loading />;
    } else if (!authUser.selectedCol) {
      return <NoCollection />;
    } else if (this.props.allCollections && authUser.selectedCol) {
      const subCollection = this.props.allCollections[
        Object.keys(authUser.selectedCol)
      ];
      // =======
      //       return <Loading />;
      //     } else if (!subscription) {
      //       return <NoCollection />;
      //     } else {
      //       const subCollection = this.props.allCollections[subscription];
      // >>>>>>> master

      return (
        <Section>
          <s.QuizTitle>
            <h1>Wardrobe</h1>
          </s.QuizTitle>
          {subCollection.slice(0, 3).map((item, index) => (
            <Fragment>
              <s.Wrapper>
                <s.ImageDiv>
                  <img alt="parfume bottle" src={parfume1} />
                </s.ImageDiv>
                <s.ParfumeDiv>
                  <s.ButtonDiv tabOpen={tabOpen} index={index}>
                    <button
                      value={'descriptionTab' + index}
                      onClick={e => this.toggleTab(e)}
                    >
                      Description
                    </button>
                    <button
                      value={'ratingTab' + index}
                      onClick={e => this.toggleTab(e)}
                    >
                      My Rating
                    </button>
                  </s.ButtonDiv>
                  <s.HeaderDiv>{item.name}</s.HeaderDiv>
                  <s.StarsDiv>
                    <StarRatingComponent
                      shit={item.base_note_id}
                      key={item.name + index}
                      name={item.name}
                      starCount={5}
                      bubbles={item.base_note_id}
                      value={
                        myWardrobe
                          ? myWardrobe.parfumes[item.name] &&
                            myWardrobe.parfumes[item.name].rating
                            ? myWardrobe.parfumes[item.name].rating
                            : 0
                          : 0
                      }
                      onStarClick={this.onStarClick.bind(
                        this,
                        item.base_note_id,
                        item.heart_note_id,
                        item.top_note_id,
                      )}
                    />
                  </s.StarsDiv>
                  <s.NotesDiv>
                    <img src={noteslogo} />
                    {item.base_note_id}, {item.top_note_id},{' '}
                    {item.heart_note_id}
                  </s.NotesDiv>

                  {tabOpen === 'ratingTab' + index ? (
                    <RatingWrapper
                      name={item.name}
                      firebase={firebase}
                      authUser={authUser.uid}
                      textFirebase={
                        myWardrobe &&
                        myWardrobe.parfumes[item.name].ownDesc
                          ? myWardrobe.parfumes[item.name].ownDesc
                          : ''
                      }
                      tabOpen={tabOpen}
                    />
                  ) : (
                    <DescriptionWrapper
                      isTruncated={isTruncated}
                      toggleTruncate={this.toggleTruncate}
                      tabOpen={tabOpen}
                    />
                  )}
                </s.ParfumeDiv>
              </s.Wrapper>
            </Fragment>
          ))}
        </Section>
      );
    }
  }
}

function DescriptionWrapper({ toggleTruncate, isTruncated }) {
  return (
    <s.DescriptionDiv>
      <Truncate
        lines={isTruncated ? 0 : 9}
        ellipsis={
          <span>
            ... <a onClick={toggleTruncate}> Read more</a>
          </span>
        }
      >
        2017's great launch from the perfume profile Pierre
        Guillaume's fragrance collection "Huitième Art" is an
        incomparable splash of fruity chords, woody notes and rich
        spices. 2017's great launch from the perfume profile Pierre
        Guillaume's fragrance collection "Huitième Art" is an
        incomparable splash of fruity chords, woody notes and rich
        spices.
        <br />
        The fact that you soon feel that you just have to shower in
        Aqaysos is not unthinkable. Is this the scent that changes
        your life?
      </Truncate>
    </s.DescriptionDiv>
  );
}

function RatingWrapper({ name, textFirebase, firebase, authUser }) {
  const [editText, setEditText] = useState(textFirebase);

  const textChange = e => {
    const text = e.target.value;
    setEditText(text);
  };

  const descriptionSubmit = event => {
    event.preventDefault();

    firebase
      .wardrobe(authUser)
      .child('parfumes')
      .child(name)
      .update({ ownDesc: editText });
  };

  return (
    <Fragment>
      <s.RatingForm onSubmit={e => descriptionSubmit(e)}>
        <s.RatingBox
          type="text"
          className="ratingBox"
          value={editText}
          onChange={e => textChange(e)}
        />

        <s.RatingButton
          className="ratingButton"
          type="submit"
          value="Submit"
        />
      </s.RatingForm>
    </Fragment>
  );
}

const mapStateToProps = state => ({
  myWardrobe: state.wardrobeState.myWardrobe,
  authUser: state.sessionState.authUser,
  allCollections: state.sortedParfumesState,
});

const mapDispatchToProps = dispatch => ({
  onSetUsers: users => dispatch({ type: 'USERS_SET', users }),
});

const condition = authUser => !!authUser;

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withAuthorization(condition),
)(WardrobePage);
