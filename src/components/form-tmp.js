




  reset() {
    const currentPoint = this._currentPoint;
    this._currentPoint.favorite = currentPoint.favorite;

    this.rerender();
  }



  _subscribeOnEvents() {
    const element = this.getElement();
    console.log(element);
    element.querySelector(`.event__favorite-btn`)
    .addEventListener(`click`, (evt) => {
      this._currentFavorite = this.favorite;

      console.log(evt);
      console.log(this._currentFavorite);
      this.rerender();
    });
  }
}
