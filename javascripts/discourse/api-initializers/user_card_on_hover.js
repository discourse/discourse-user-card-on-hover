import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.11.1", (api) => {
  api.modifyClass("component:user-card-contents", {
    didInsertElement() {
      this._super(...arguments);

      document
        .querySelector("#main-outlet")
        .addEventListener("mouseover", this.showCard.bind(this));

      document
        .querySelector("#main-outlet")
        .addEventListener("mouseout", this.hideCard.bind(this));
    },

    showCard(event) {
      if (this.lastEvent && this.lastEvent.type === "click") {
        return;
      }

      this._cardClickHandler(event);
    },

    hideCard(event) {
      if (this.lastEvent && this.lastEvent.type === "click") {
        return;
      }

      if (this.avatarSelector) {
        this._hideCard(event, this.avatarSelector);
      }

      if (this.mentionSelector) {
        this._hideCard(event, this.mentionSelector);
      }
    },

    _hideCard(event, selector) {
      const hadCard = !!event.fromElement.closest(selector);
      const hasCard = !!event.toElement.closest(selector);

      if (hadCard && !hasCard) {
        this._close();
      }
    },
  });
});
