export default function CataloguePage() {
  return (
    <>
      <h1>Catalogue</h1>
      <div className="grid">
        <a className="card" href="/catalogue/bois-de-construction">Bois de construction</a>
        <a className="card" href="/catalogue/bois-scié">Bois scié</a>
        <a className="card" href="/catalogue/bois-de-chauffage">Bois de chauffage</a>
        <a className="card" href="/catalogue/bois-sauna">Bois sauna</a>
        <a className="card" href="/catalogue/bois-decoratif">Bois décoratif</a>
        <a className="card" href="/catalogue/panneaux">Panneaux</a>
        <a className="card" href="/catalogue/bois-exterieur">Bois extérieur</a>
        <a className="card" href="/catalogue/bois-brut-industriel">Bois brut / industriel</a>
      </div>
    </>
  )
}
