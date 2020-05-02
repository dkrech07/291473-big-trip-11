
// const getFormElement = () => {
//   this._formComponent = new FormComponent(this._point);
//   return this._formComponent.getElement().querySelector(`form`);
// }; - ЭТО НЕНУЖНЫЙ КУСОК КОДА



    // const favoriteButtonClickHandler = () => {
    //   this._onDataChange(this, this._point, Object.assign({}, this._point, {
    //     favorite: !this._point.favorite,
    //   }));
    // };

    const eventButtonClickHandler = () => {
      getFormElement();
      this._replacePointToEdit();

      this._formComponent.setEditFormClickHandler(editFormClickHandler);
      document.addEventListener(`keydown`, this._onEscKeyDown);
      this._formComponent.setFavoriteButtonClickHandler(favoriteButtonClickHandler);
    };

    const editFormClickHandler = (evt) => {
      evt.preventDefault();
      this._formComponent.reset();
      this._replaceEditToPoint();

      getFormElement().removeEventListener(`submit`, editFormClickHandler);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      remove(this._formComponent);
    };

    this._onEscKeyDown = (evt) => {
      if (evt.keyCode === ESC_KEYCODE) {
        editFormClickHandler(evt);
      }
    };

    this._pointComponent.setEventButtonClickHandler(eventButtonClickHandler);
  }

  // setDefaultView() {
  //   if (this._mode !== Mode.DEFAULT) {
  //     this._replaceEditToPoint();
  //   }
  // }
  //
  // _replacePointToEdit() {
  //   this._onViewChange();
  //   replace(this._formComponent, this._pointComponent);
  //   this._mode = Mode.EDIT;
  // }
  //
  // _replaceEditToPoint() {
  //   document.removeEventListener(`keydown`, this._onEscKeyDown);
  //   this._formComponent.reset();
  //
  //   replace(this._pointComponent, this._formComponent);
  //   this._mode = Mode.DEFAULT;
  // }
}
