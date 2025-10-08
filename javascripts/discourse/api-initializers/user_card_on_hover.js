import { apiInitializer } from "discourse/lib/api";
import { bind } from "discourse/lib/decorators";

export default apiInitializer((api) => {
  api.modifyClass(
    "component:user-card-contents",
    (Superclass) =>
      class extends Superclass {
        didInsertElement() {
          super.didInsertElement(...arguments);

          this.appEvents.on("card:show", this, this.onShow);
          this.appEvents.on("card:hide", this, this.onHide);

          const mainOutlet = document.querySelector("#main-outlet");
          mainOutlet.addEventListener("mouseover", this.showCard);
          mainOutlet.addEventListener("mouseout", this.hideCard);
        }

        willDestroyElement() {
          super.willDestroyElement(...arguments);

          this.appEvents.off("card:show", this, this.onShow);
          this.appEvents.off("card:hide", this, this.onHide);

          const mainOutlet = document.querySelector("#main-outlet");
          mainOutlet.removeEventListener("mouseover", this.showCard);
          mainOutlet.removeEventListener("mouseout", this.hideCard);
        }

        onShow(_username, _target, event) {
          this.set("lastEvent", event);
        }

        onHide() {
          this.set("lastEvent", null);
        }

        @bind
        showCard(event) {
          if (this.lastEvent && this.lastEvent.type === "click") {
            return;
          }

          this._cardClickHandler(event);
        }

        @bind
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
        }

        _hideCard(event, selector) {
          const hadCard = !!event.fromElement?.closest(selector);
          const hasCard = !!event.toElement?.closest(selector);

          if (hadCard && !hasCard) {
            this._close();
          }
        }
      }
  );
});
