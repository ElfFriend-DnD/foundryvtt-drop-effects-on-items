class DropEffectsOnItems {
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

    if (!effectsList) {
      return;
    }

    const dragDrop = new DragDrop({
      dragSelector: '[data-effect-id]',
      dropSelector: '.effects-list',
      permissions: { dragstart: () => true, dragdrop: () => app.isEditable && !app.item.isOwned },
      callbacks: { dragstart: this._onDragStart(app.object), drop: this._onDrop(app.object) }
    });

    this.log('binding dragdrop', dragDrop);

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

    // outputs the type and uuid
    const dragData = effect.toDragData();

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
    this.log('DragDrop dropping');

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

    const effectDocument = await ActiveEffect.implementation.fromDropData(dropData);

    if (!effectDocument) {
      return false;
    }

    this.log('DragDrop drop starting:', {
      effectParent,
      dropData,
      effectDocument,
    });

    // create the new effect but make the 'origin' the new parent item
    return ActiveEffect.create(
      {
        ...effectDocument.toObject(),
        origin: effectParent.uuid,
      }, {parent: effectParent}
    );
  }
}

Hooks.on("ready", DropEffectsOnItems.init);

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(DropEffectsOnItems.MODULE_NAME);
});
