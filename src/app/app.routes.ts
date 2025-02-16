import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/homepage/homepage.component').then((m) => m.HomepageComponent),
    title: '',
    pathMatch: 'full'
  },
  {
    path: 'ventes-aux-encheres',
    loadComponent: () =>
      import('./pages/auctions/auctions.component').then((m) => m.AuctionsComponent),
    title: 'Ventes aux enchères'
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then((m) => m.ContactComponent),
    title: 'Contact'
  },
  {
    path: 'infos-encheres',
    loadComponent: () =>
      import('./pages/infos-auction/infos-auction.component').then((m) => m.InfosAuctionComponent),
    title: 'Infos Enchères'
  },
  {
    path: 'le-cabinet',
    loadComponent: () =>
      import('./pages/office/office.component').then((m) => m.OfficeComponent),
    title: 'Le cabinet'
  },
  {
    path: 'competence-selectionnee',
    loadComponent: () =>
      import('./pages/selected-skill/selected-skill.component').then((m) => m.SelectedSkillComponent),
    title: 'Compétence sélectionnée'
  },
  {
    path: 'competences',
    loadComponent: () =>
      import('./pages/skills/skills.component').then((m) => m.SkillsComponent),
    title: 'Compétences'
  },
  {
    path: 'equipe',
    loadComponent: () =>
      import('./pages/team/team.component').then((m) => m.TeamComponent),
    title: 'Équipe'
  },
  {
    path: '404',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Page non trouvée'
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

export default routes;
