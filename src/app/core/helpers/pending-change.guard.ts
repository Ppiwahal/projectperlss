import { ActivatedRouteSnapshot, CanDeactivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SaveWarningPopupComponent } from 'src/app/save-warning-popup/save-warning-popup.component';
import { PaeCommonService } from '../services/pae/pae-common/pae-common.service';

export interface ComponentCanDeactivate {
    canDeactivate: () => boolean | Observable<boolean>;
    resetForm()
}

@Injectable({ providedIn: 'root' })
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
    destinationUrl = 'ltss/pae';
    constructor(private dialog: MatDialog, private route: Router) { }

    canDeactivate(component: ComponentCanDeactivate, route: ActivatedRouteSnapshot, state: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | Observable<boolean> {
        this.destinationUrl = nextState.url;
        return component ? component.canDeactivate() ?
            true :
            this.showWarning(component) : true;
    }

    showWarning(component: ComponentCanDeactivate) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = 'exp_popup';
        dialogConfig.width = '535px';
        dialogConfig.height = '360px';
        dialogConfig.autoFocus = false;
        const dialogRef = this.dialog.open(SaveWarningPopupComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(re => {
            // if(this.commonService.getCanLeave() && this.commonService.getModule()=== 'pae' ){
            //    this.route.navigate([this.destinationUrl]);
            // }
            if (re.data) {
                component.resetForm();
                this.route.navigate([this.destinationUrl]);
            }
        })
        return false;
    }
}