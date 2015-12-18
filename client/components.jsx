var React = require("react");

var GameEntry = React.createClass({
  handleClick: function() {
    $("#webview").attr("src", this.props.game.url);
  },
  render: function() {
    var title_string = this.props.game.name;
    if (this.props.game.download_progress) {
      title_string = "(" + Math.floor(this.props.game.download_progress * 100) + "%) " + title_string;
    }
    return <span onClick={this.handleClick} className="nav-group-item">{title_string}</span>;
  }
});

var GameList = React.createClass({
  render: function() {
    var self = this;
    var make_game_entry = function(game) {
      return <GameEntry key={self.props.games.indexOf(game)} game={game}/>
    }
    var is_downloading = function(game) {
      return game.download_progress;
    }
    var not_downloading = (game) => {return !is_downloading(game)};
    var downloading_games_tag = <span><h5 className="nav-group-title">Downloading Games</h5>
      {this.props.games.filter(is_downloading).map(make_game_entry)}</span>
    return <div className="nav-group">
      <h5 className="nav-group-title">Installed Games</h5>
      { this.props.games.filter(not_downloading).map(make_game_entry) }
      { this.props.games.filter(is_downloading).length > 0 ? downloading_games_tag : undefined }
    </div>
  }
});

module.exports = {
  GameList, GameEntry
}
