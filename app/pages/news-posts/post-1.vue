<template>
  <div class="max-w-4xl mx-auto px-4 pt-40 md:pt-52 pb-24 relative z-10 min-h-screen flex flex-col gap-12 md:gap-16">
    <NewsHero 
      title="The Great Vault Opens Again" 
      date="November 12, 2024" 
      tag="Announcement"
      image="https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=2070&auto=format&fit=crop"
    />
    
    <NewsTextCard>
      <h2>A New Season Begings!</h2>
      <p>
        The gates have been unsealed and the <strong>Great Vault</strong> is demanding tribute once more. 
        Our scouts report increased activity in the lower reaches of the citadel. It's time to test our mettle 
        and secure the rarest of loot.
      </p>
      <p>
        We'll be organizing guild groups starting this Tuesday. Please make sure your 
        <a href="#">attendance is marked</a> in the discord channel so our raid leaders can form the groups accordingly.
      </p>
    </NewsTextCard>

    <NewsQuote 
      quote="I didn't farm mythics all week just to roll a socket on a tier piece I already have." 
      author="Gnomercy" 
      role="Main Tank"
    />

    <NewsTextCard variant="highlight">
      <h2>Loot Rules Update</h2>
      <p>
        As a reminder, our loot council rules have been slightly adjusted to heavily favor 
        those who actually show up to reclears. Don't be that guy logging on only for progression nights.
      </p>
    </NewsTextCard>
  </div>
</template>
