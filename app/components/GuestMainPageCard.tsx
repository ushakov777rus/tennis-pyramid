"use client";

type GuestMainPageCardProps = {
  onSignupPlayer?: () => void;
  onSignupAdmin?: () => void;
  className?: string;
};

export function GuestMainPageCard({
  onSignupPlayer,
  onSignupAdmin,
  className = "",
}: GuestMainPageCardProps) {
  return (
    <section className={`section ${className}`}>
      <h2 className="section-title">Регистрация</h2>
      <div className="card-grid">
        <div
          className="card card-register clickable"
          onClick={onSignupPlayer}   // 👈 дергаем проп
        >
          <div className="card-icon">🏅</div>
          Зарегистрироваться как участник
          <div className="badge badge-register">
            Участвуй в турнирах, прокачивайся, побеждай, попади в рейтинг лучших
          </div>
        </div>

        <div
          className="card card-register clickable"
          onClick={onSignupAdmin}   // 👈 дергаем проп
        >
          <div className="card-icon">🏆</div>
          Зарегистрироваться как организатор
          <div className="badge badge-register">
            Организовывай турниры, выбирай любой формат, управляй матчами и следи за результатами
          </div>
        </div>
      </div>
    </section>
  );
}