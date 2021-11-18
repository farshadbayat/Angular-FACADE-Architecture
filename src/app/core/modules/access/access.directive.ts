import { Directive, HostBinding, Input, OnChanges, OnInit, Renderer2, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';

const DISABLE_STYLE ='border-color #00000033; cursor: not-allowed; color: #00000073; background: rgba(0, 0, 0, 0.12); box-shadow: none;';

// tslint:disable-next-line: directive-selector
@Directive({ selector: '[access]' })
export class AccessDirective implements OnChanges, OnInit {
  @Input() access?: boolean;

  constructor(private _viewContainer: ViewContainerRef,
              private templateRef: TemplateRef<any>,
              private _renderer: Renderer2) {}

  ngOnInit(): void {
    // console.log( this.access );
    // this.doRender();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.access) {
      this.doRender();
    }
  }

  doRender() {
      if(this.access === false || this.access === undefined) {
        this._viewContainer.clear();
      } else if(this.access === null) {
        this._viewContainer.clear();
        this._viewContainer.createEmbeddedView(this.templateRef);
        window.requestAnimationFrame( () => {
          const element = this.templateRef.elementRef.nativeElement.previousElementSibling; // skip access meta data
          element.style.cssText = DISABLE_STYLE;
          this._renderer.setAttribute(element, 'disabled', 'disabled');
        });
      } else if(this.access === true){
        this._viewContainer.clear();
        this._viewContainer.createEmbeddedView(this.templateRef);
      }
  }
}
