export class DropEffectsOnItems {
  static MODULE_NAME = "drop-effects-on-items";
  static MODULE_TITLE = "Drop Effects on Items";

  static log(...args) {
    if (game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.MODULE_NAME)) {
      console.log(this.MODULE_TITLE, '|', ...args);
    }
  }

  static init = async () => {
    console.log(`${DropEffectsOnItems.MODULE_NAME} | Initializing ${DropEffectsOnItems.MODULE_TITLE}`);

    Hooks.on('renderItemSheet', this.handleItemSheetRender);
  }

  static handleItemSheetRender = (app, html) => {
    const effectsList = html.find('.effects-list');

    if (app.item.isOwned || !effectsList || !app.isEditable) {
      return;
    }

    this.log('binding dragdrop');

    const dragDrop = new DragDrop({
      dragSelector: '[data-effect-id]',
      dropSelector: '.effects-list',
      permissions: { drag: () => app.isEditable, drop: () => app.isEditable },
      callbacks: { dragstart: this._onDragStart(app.object), drop: this._onDrop(app.object) }
    });

    dragDrop.bind(html[0]);
  }


  /**
   * The Drag Start event which populates data to create an effect on drop
   * @param {*} event 
   */
   static _onDragStart = (effectParent) => (event) => {
    if (!effectParent) {
      this.log('DragDrop _onDragStart no parent', {
        effectParent
      });
  
      return;
    }

    const li = event.currentTarget;
    const effectId = li.dataset?.effectId;
    
    if (!effectId) {
      return;
    }

    const effect = effectParent.effects.get(effectId);
    
    if (!effect) {
      return;
    }

    // Create drag data
    const dragData = {
      type: 'ActiveEffect',
      data: effect.data,
    };

    this.log('DragDrop dragStart:', {
      effect,
      dragData,
    });

    // Set data transfer
    event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  };

  /**
   * When an effect is dropped on the sheet, create a copy of that effect
   */
  static _onDrop = (effectParent) => async (event) => {
    if (!effectParent) {
      return;
    }

    // Try to extract the data
    let dropData;
    try {
      dropData = JSON.parse(event.dataTransfer.getData('text/plain'));

      this.log('DragDrop drop', {
        event,
        dropData,
      });
    } catch (err) {
      this.log('DragDrop drop', {
        err,
      });

      return false;
    }


    if (dropData.type !== 'ActiveEffect') return false;


    if (!!effectParent.effects.get(dropData.data._id)) {
      return;
    }

    this.log('DragDrop drop starting:', {
      effectParent,
      dropData,
    });

    return ActiveEffect.create(
      {
        ...dropData.data,
        origin: effectParent.uuid,
        _id: null,
      }, {parent: effectParent}
    );
  }
}

Hooks.on("ready", DropEffectsOnItems.init);

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(DropEffectsOnItems.MODULE_NAME);
});
