import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  markAllQuoteSeen,
} from '../actions/voz';

class QuoteList extends Component {
  static propTypes = {
    settings: PropTypes.object,
    dispatch: PropTypes.func,
    quoteList: PropTypes.array,
    countUnseen: PropTypes.number,
  }

  static defaultProps = {
    quoteList: [],
    settings: {},
    countUnseen: 0,
  }

  constructor(comProps) {
    super(comProps);

    this.state = {
      showQuoteList: false,
    };
    this.dispatch = comProps.dispatch;
  }

  getTime(timeStamp) {
    const date = new Date(timeStamp);
    return `${date.getHours()}:${date.getMinutes()} ${date.getDay()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  toggleQuoteList() {
    const { showQuoteList } = this.state;
    const { countUnseen } = this.props;

    if (showQuoteList === false && countUnseen !== 0) {
      this.dispatch(markAllQuoteSeen());
    }
    this.setState({ showQuoteList: !showQuoteList });
  }

  renderQuote(quote) {
    return (
      <div className="quote-row" key={quote.post.id}>
        <div className="quote-title">{quote.thread.title}</div>
        <div className="quote-content">{quote.post.content}</div>
        <div className="quote-bottom">
          By <a
            className="quote-item-author"
            href={`/member.php?u=${quote.author.userid}`} target="_blank"
          >({quote.author.username})
          </a> on {this.getTime(quote.post.datetime)}
        </div>
      </div>
    );
  }

  render() {
    const { notifyQuote } = this.props.settings;

    if (!notifyQuote) return null;

    const { quoteList, countUnseen } = this.props;

    return (
      <div className="btn-group">
        <div
          className="btn"
          onClick={() => this.toggleQuoteList()}
        >
          <i className="fa fa-quote-right"></i>
          <div className="badge">{countUnseen}</div>
        </div>
        {(() => {
          if (this.state.showQuoteList) {
            return (
              <div className="btn-options">
                <h3>Quotes</h3>
                <div className="quote-list">
                  {quoteList.map(quote => this.renderQuote(quote))}
                </div>
              </div>
            );
          }
          return null;
        })()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { quoteList, settings } = state.vozLiving;
  const countUnseen = quoteList.reduce((r, q) => {
    let outResult = r;
    if (q.hasSeen === false) outResult += 1;
    return outResult;
  }, 0);

  return { quoteList, settings, countUnseen };
};

export default connect(mapStateToProps)(QuoteList);