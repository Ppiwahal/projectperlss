import { UrlSerializer, UrlTree, DefaultUrlSerializer } from '@angular/router';

export class CustomUrlSerializer implements UrlSerializer {
  parse(url: any): UrlTree {
    const dus = new DefaultUrlSerializer();
    console.log("Parse called");
    return dus.parse(unescape(url));
  }

  serialize(tree: UrlTree): any {
    const dus = new DefaultUrlSerializer();
    console.log("Serialize called");
    return dus.serialize(tree);
  }
}
