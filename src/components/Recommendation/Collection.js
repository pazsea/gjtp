import React, { Component, Fragment } from 'react';
import * as ROUTES from '../../constants/routes';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import './styles.css';
import {
  Header,
  FlexContainer,
  ImageFlexContainer,
  TextFlexContainer,
  Description,
  SubscribeButton,
} from './styles';
import genericParfumeBottle from '../../images/genericParfumeBottle.jpg';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

class Collection extends Component {
  state = {
    loading: true,
  };

  componentDidMount() {
    this.props.firebase
      .user(this.props.authUser.uid)
      .child('recommendedCol')
      .once('value', snapshot => {
        if (snapshot.val()) {
          const collection = Object.keys(snapshot.val());
          this.setState({ selectedCol: collection, loading: false });
        } else {
          return null;
        }
      });
  }

  // async componentWillMount() {
  //   this.getCollection();
  //   console.log(this.getCollection());
  // }
  // getCollection() {
  //   this.props.firebase
  //     .user(this.props.authUser.uid)
  //     .child('recommendedCol')
  //     .once('value', snapshot => {
  //       const collection = Object.keys(snapshot.val());
  //       // console.log(collection);
  //       // return collection;
  //     });
  // }

  render() {
    const { loading, selectedCol } = this.state;

    if (loading || selectedCol === undefined) {
      console.log(selectedCol);
      return (
        <h2>
          Du har ingen rekommenderad kollektion. Har du fyllt i quiz
          spelet?
        </h2>
      );
    } else {
      console.log(this.state.selectedCol);
      const {
        image,
        headerImage,
        title,
        firstDescription,
      } = this.props[selectedCol];
      return (
        <Fragment>
          <Header headerImage={headerImage} />

          <FlexContainer>
            <ImageFlexContainer>
              <img src={image} alt="" />
              <img src={genericParfumeBottle} alt="" />
            </ImageFlexContainer>
            <TextFlexContainer>
              <h1>{title}</h1>
              <h2>159 KR/MÅNAD</h2>

              <SubscribeButton>
                <button>
                  <Link to={ROUTES.HOME}>Prenumerera</Link>
                </button>
              </SubscribeButton>

              <Description>
                {firstDescription.split('/n').map((desc, index) => (
                  <p>{desc}</p>
                ))}
                <ul>
                  <li>Ny doft varje månad</li>
                  <li>Smart etui att ta med</li>
                  <li>Dofter utvalda av experter</li>
                  <li>Byt eller pausa när du vill</li>
                  <li>Ingen bindningstid</li>
                  <li>Fri frakt</li>
                </ul>
                <br />
                <br />
                <p>
                  <i>
                    <b>Sniph</b> är en prenumerationstjänst som gör
                    det enkelt att upptäcka nya dofter. Vi skickar dig
                    varje månad mindre flaskor med kända parfymer, som
                    du använder i vårt smarta etui. Prenumerationen
                    kostar 159 kr/mån utan bindningstid.
                  </i>
                </p>
              </Description>
            </TextFlexContainer>
          </FlexContainer>
        </Fragment>
      );
    }

    // }
    // const { selected } = this.state;
    // console.log('RENDER ' + this.getCollection());
    // console.log('PROPS ' + this.props.colSuggested);
    // const {
    //   image,
    //   headerImage,
    //   title,
    //   firstDescription,
    // } = this.props[selected];
    // return <div>heeej</div>;

    //   <Fragment>
    //     <Header headerImage={headerImage} />

    //     <FlexContainer>
    //       <ImageFlexContainer>
    //         <img src={image} alt="" />
    //         <img src={genericParfumeBottle} alt="" />
    //       </ImageFlexContainer>
    //       <TextFlexContainer>
    //         <h1>{title}</h1>
    //         <h2>159 KR/MÅNAD</h2>

    //         <SubscribeButton>
    //           <button>
    //             <Link to={ROUTES.HOME}>Prenumerera</Link>
    //           </button>
    //         </SubscribeButton>

    //         <Description>
    //           {firstDescription.split('/n').map((desc, index) => (
    //             <p>{desc}</p>
    //           ))}
    //           <ul>
    //             <li>Ny doft varje månad</li>
    //             <li>Smart etui att ta med</li>
    //             <li>Dofter utvalda av experter</li>
    //             <li>Byt eller pausa när du vill</li>
    //             <li>Ingen bindningstid</li>
    //             <li>Fri frakt</li>
    //           </ul>
    //           <br />
    //           <br />
    //           <p>
    //             <i>
    //               <b>Sniph</b> är en prenumerationstjänst som gör det
    //               enkelt att upptäcka nya dofter. Vi skickar dig varje
    //               månad mindre flaskor med kända parfymer, som du
    //               använder i vårt smarta etui. Prenumerationen kostar
    //               159 kr/mån utan bindningstid.
    //             </i>
    //           </p>
    //         </Description>
    //       </TextFlexContainer>
    //     </FlexContainer>
    //   </Fragment>
    // );
  }
}

const mapStateToProps = state => ({
  users: state.userState.users,
  authUser: state.sessionState.authUser,
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
)(Collection);
