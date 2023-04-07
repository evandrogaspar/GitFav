import { GithubUser } from "./GithubUser.js"

//class para organizar os dados
export class Favorites {
  constructor(root){
    this.root = document.querySelector(root)
    this.load()
  }

  save(){
    localStorage.setItem("@github-favorites:", JSON.stringify(this.dataEntries))
  }

  async addFavorite(username){
      try {

        const userExists = this.dataEntries.find(entry => entry.login === username)

        if(userExists){
          throw new Error("Usuário já cadastrado.")
        }

        const user = await GithubUser.search(username)

        if(user.login === undefined){
          throw new Error("Usuário não encontrado!")
        }

        
        this.dataEntries = [user, ...this.dataEntries]
        this.update()
        this.save()

   

      }catch(error){
        alert(error.message)
      }
      
      const inputValue = document.querySelector(".search input")
      inputValue.value = ""
    }


      load() {
        this.dataEntries = JSON.parse(localStorage.getItem("@github-favorites:")) || []
      }
  

  delete(user){
    const filteredDataEntries = this.dataEntries.filter(entry => entry.login !== user.login)

    this.dataEntries = filteredDataEntries
    this.update()
    this.save()
  }
}

//class que cria visualização e eventos do HTML
export class FavoritesViews extends Favorites{
  constructor(root){
    super(root)

    this.tbody = this.root.querySelector("table tbody")

    this.update()
    this.getValue()
  }

    getValue(){
    const addFavorite = this.root.querySelector(".search button")

    addFavorite.onclick = () => {
      const { value } = this.root.querySelector(".search input")

      this.addFavorite(value)
    }

 

  }

  update(){
    this.removeTr()

    this.dataEntries.forEach( user => {
      const row = this.createRow()
      
      row.querySelector(".user img").src =`https://github.com/${user.login}.png`
      row.querySelector(".user img").alt =`Imagem de ${user.name}`

      row.querySelector(".user a").href = `hhtps://github.com/${user.login}`
      row.querySelector(".user p").textContent = user.name
      row.querySelector(".user span").textContent = user.login
      row.querySelector(".repositories").textContent = user.public_repos
      row.querySelector(".followers").textContent = user.followers

      row.querySelector(".remove").onclick = () => {
        const isItOk = confirm("Tem a certeza que deseja apagar essa linha ?")

        if(isItOk){
          this.delete(user)
        }
      }
      this.tbody.append(row)

    })

    const tableLines = document.querySelector("table").rows.length
    const noFavoritesMessage = document.querySelector(".no-favorites") 

    if(tableLines > 1){
      noFavoritesMessage.classList.add("hide")
    }else {
      noFavoritesMessage.classList.remove("hide")
    }

  }

  createRow(){
    const tr = document.createElement("tr")

    tr.innerHTML = `
    <td class="user">
    <img src="https://github.com/evandrogaspar.png" alt="Imagem do evandro gaspar">
    <a href="https://github.com/evandrogaspar">
      <p>Evandro Gaspar</p>
      <span>/evandrogaspar</span>
    </a>
    </td>
   <td class="repositories">16</td>
    <td class="followers">8</td>
    <td>
    <button class="remove">Remover</button>
    </td>
    `
    return tr
  }

  removeTr(){
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove()
    })
  }
}