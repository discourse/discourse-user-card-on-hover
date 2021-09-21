import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.11.1", (api) => {
  api.modifyClass("component:user-card-contents", {
    didInsertElement() {
      this._super(...arguments);

      this.appEvents.on("card:show", this, this.onShow);
      this.appEvents.on("card:hide", this, this.onHide);

      const mainOutlet = document.querySelector("#main-outlet");
      mainOutlet.addEventListener("mouseover", this.showCard.bind(this));
      mainOutlet.addEventListener("mouseout", this.hideCard.bind(this));
    },

    willDestroyElement() {
      this._super(...arguments);

      this.appEvents.off("card:show", this, this.onShow);
      this.appEvents.off("card:hide", this, this.onHide);

      const mainOutlet = document.querySelector("#main-outlet");
      mainOutlet.removeEventListener("mouseover", this.showCard.bind(this));
      mainOutlet.removeEventListener("mouseout", this.hideCard.bind(this));
    },

    onShow(_username, _target, event) {
      this.set("lastEvent", event);
    },

    onHide() {
      this.set("lastEvent", null);
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
