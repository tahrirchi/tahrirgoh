import {Directive, Input, TemplateRef, ElementRef, OnInit, HostListener, ComponentRef, OnDestroy} from '@angular/core';
import {Overlay, OverlayPositionBuilder, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {AnnotationPopoverComponent} from "./annotation-popover.component";

@Directive({
  selector: '[customToolTip]'
})
export class AnnotationPopoverDirective {

  /**
   * This will be used to show tooltip or not
   * This can be used to show the tooltip conditionally
   */
  @Input() showToolTip: boolean = true;

  private _overlayRef: OverlayRef | undefined;
  private _tooltipRef: ComponentRef<AnnotationPopoverComponent> | undefined;

  constructor(private _overlay: Overlay,
              private _overlayPositionBuilder: OverlayPositionBuilder,
              private _elementRef: ElementRef) {
  }

  /**
   * Init life cycle event handler
   */
  ngOnInit() {
    if (!this.showToolTip) {
      return;
    }
  }

  @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent) {
    const selection = window.getSelection();

    console.log(selection);

    // Replace/Delete operation
    if (selection) {
      //attach the component if it has not already attached to the overlay
      if (this._overlayRef && this._overlayRef.hasAttached()) {
        this.closeToolTip()
      }
      // Range is selected
      console.log('Range selected:', selection.toString());

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      this._overlayRef = this._overlay.create({
        positionStrategy: this._overlayPositionBuilder
          .flexibleConnectedTo({ x: rect.x, y: rect.bottom })
          .withPositions([{
            originX: 'start',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'top',
            offsetY: 5,
          }])
      })

      const tooltipRef: ComponentRef<AnnotationPopoverComponent> = this._overlayRef.attach(new ComponentPortal(AnnotationPopoverComponent));
      tooltipRef.instance.oldText = selection.toString();
      tooltipRef.instance.newText = selection.toString();
      tooltipRef.instance.offset = range.startOffset;

      tooltipRef.instance.close.asObservable().subscribe((e) => {
        this.closeToolTip();
      })

      this._tooltipRef = tooltipRef;
    } else {
      if (this._overlayRef && this._overlayRef.hasAttached()) {
        this.closeToolTip()
      }
    }
  }

  // @HostListener('document:click', ['$event.target']) onClick(target: any) {
  //   const clickedInside =
  //     this._elementRef.nativeElement.contains(target) ||
  //     this._overlayRef?.overlayElement.contains(this._elementRef.nativeElement)
  //
  //   console.log("target", target)
  //   console.log(this._overlayRef?.overlayElement)
  //   if (!clickedInside) {
  //     // Clicked outside the directive's element
  //     this.closeToolTip();
  //   }
  // }

  /**
   * Destroy lifecycle event handler
   * This method will make sure to close the tooltip
   * It will be needed in case when app is navigating to different page
   * and user is still seeing the tooltip; In that case we do not want to hang around the
   * tooltip after the page [on which tooltip visible] is destroyed
   */
  ngOnDestroy() {
    this.closeToolTip();
  }

  /**
   * This method will close the tooltip by detaching the component from the overlay
   */
  private closeToolTip() {
    if (this._overlayRef) {
      this._overlayRef.detach();
    }
  }

  // private getOffsetWithinElement(node: Node): number {
  //   let offset = 0;
  //   while (node && node !== this._elementRef.nativeElement) {
  //     offset += node.parentNode ? Array.from(node.parentNode.childNodes).indexOf(node) : 0;
  //     node = node.parentNode;
  //   }
  //   return offset;
  // }

}
