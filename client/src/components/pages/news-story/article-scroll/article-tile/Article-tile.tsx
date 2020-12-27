import React, { FunctionComponent } from 'react';
import './Article-tile.css';

import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';

import { createArticle, createUserHistory } from '../../../../../services/api';

type ArticleTileProps = {
  article: any,
  loginUser: any,
  setLoginUser: Function,
  scrollColor: string,
  setClickedArticle: Function,
  setMenuState: Function,
}

const ArticleTile: FunctionComponent<ArticleTileProps> = ({ article, loginUser, setLoginUser, scrollColor, setClickedArticle, setMenuState }) => {

  let articleText = article.title;

  if (articleText.split('').length > 100) {
    articleText = articleText.split('');
    articleText = articleText.slice(0, 100);
    articleText.push('.', '.', '.');
    articleText = articleText.join('');
  }

  const ShareClick = () => {
    setClickedArticle(article);
    setMenuState(true);
  };

  function clickHandler () {
    createArticle(article)
      .then((res: any) => res.json())
      .then((res: any) => {
        const articleInfo = res;
        const existingArticle = loginUser.article.filter((el: any) => el._id === articleInfo._id);

        if (existingArticle.length === 0) {
          createUserHistory(loginUser.googleId, articleInfo)
            .then((res: any) => res.json())
            .then((res: any) => setLoginUser(res));
        }
      });

  }


  return (
    <Card className="ArticleTileCardWrapper" style={{ marginLeft: '2.5vw', backgroundColor: scrollColor }}>
      <div className="ArticleTileWrapper">
        <a href={article.link} target="_blank" rel="noreferrer noopener" className="StoryAttribute" onClick={clickHandler}>
          <div className="RowOne">
            <div className="TextOne">
              <p className="ArticleTileSource">{article.source}</p>
              <h2 className="ArticleTileTitle">{articleText}</h2>
            </div>
            <img src={article.image.replace('-rw', '')} alt={article.subtitle.split('').slice(0, 110).join('')} className="ArticleTileImage"></img>
          </div>
        </a>

        <div className="RowTwo">
          <p className="ArticleTileTime">{article.time}</p>
          <IconButton onClick={ShareClick} style={{ alignSelf: 'center' }}>
            <ShareIcon style={{ fontSize: 18, }}></ShareIcon>
          </IconButton>
        </div>
      </div>
    </Card>
  );
};

export default ArticleTile;


