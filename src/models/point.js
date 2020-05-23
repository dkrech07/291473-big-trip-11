export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.favorite = Boolean(data[`is_favorite`]);
    this.departure = new Date(data[`date_from`]);
    this.arrival = new Date(data[`date_to`]);
    this.price = data[`base_price`];
    this.type = data[`type`];
    this.offers = data[`offers`];
    this.destinationInfo = data[`destination`];
  }

  toRAW() {
    return {
      // 'id': this.id,
      'is_favorite': this.favorite,
      'date_from': this.departure,
      'date_to': this.arrival,
      'base_price': this.price,
      'type': this.type.toLowerCase(),
      'offers': this.offers,
      'destination': this.destinationInfo,
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}
