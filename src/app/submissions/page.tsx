export default function Submissions() {
  return (
    <div>
      <h1>Подача заявки</h1>

      <div>
        <p>- Подача заявок триває з 01.10.2025 по 10.11.2025</p>
        <p>- При подачі заявки всі обов&apos;язкові поля мають бути заповнені</p>
        <p>- Результати будуть оголошені напротязі тижня з моменту закриття подачі заявок</p>
        <p>- Один учасник може подати до 4 заявок</p>
        <p>- Заявка подається на кожну номінацію окремо</p>
        <p>- Музика та/або фон мають бути завантажені у папку на Google Drive та посилання на них має бути вказано в полі &quot;Посилання на музику та/або фон&quot;</p>
      </div>

      <form>
        <div>
          <label htmlFor="name">Ім&apos;я</label>
          <input type="text" id="name" name="name" />
        </div>
        
        <div>
          <label htmlFor="email">Нік/Назва команди</label>
          <input type="text" id="nickname" name="nickname" />
        </div>
        
        <div>
          <label htmlFor="phone">Телефон</label>
          <input type="tel" id="phone" name="phone" />
        </div>
        
        
      </form>
    </div>
  )
}