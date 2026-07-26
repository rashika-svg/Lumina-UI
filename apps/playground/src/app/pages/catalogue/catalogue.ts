import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  Avatar,
  Badge,
  Button,
  Card,
  InputField,
  Skeleton,
  Spinner,
  Switch,
} from '@lumina/ui';
import { DOCS } from '../docs/docs-registry';

/** Component catalogue — a visual gallery of every flagship component. */
@Component({
  selector: 'lpg-catalogue',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    Button,
    Badge,
    Avatar,
    InputField,
    Switch,
    Card,
    Spinner,
    Skeleton,
  ],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css',
})
export class CataloguePage {
  protected readonly components = DOCS.filter(
    (d) => d.group === 'Components' || d.group === 'Feedback',
  );
}
